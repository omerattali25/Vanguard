import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine, MachineStatus } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineInputDto } from './dto/machine.input.dto';
import { MachineUpdateDto } from './dto/machine.update.dto';
import { randomUUID } from 'crypto';
import { MachineAction, MachineActionType } from './entity/machine.action.entity';
import { MachineActionDto } from './dto/machine.action.dto';
import { Patient } from '@vanguard/types';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
    @InjectRepository(MachineAction)
    private readonly machineActionRepo: Repository<MachineAction>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {}

  async getMachines(): Promise<Machine[]> {
    return await this.machineRepo.find();
  }
  async saveMachine(machineInput: MachineInputDto): Promise<Machine> {
    const newMachine = this.machineRepo.create(machineInput);
    const savedMachine = await this.machineRepo.save(newMachine);
    this.redisClient.publish('machines', JSON.stringify(savedMachine));
    return savedMachine;
  }
  async updateMachine(id: string, machineUpdateDto: MachineUpdateDto) {
    const machine = await this.machineRepo.findOne({
      where: { id:id },
    });
    if (!machine) return 'machine with this id not found';
    machine.name = machineUpdateDto.name || machine.name;
    machine.location = machineUpdateDto.location || machine.location;
    await this.machineRepo.save(machine);
    this.redisClient.publish('machines', JSON.stringify(machine));
  }
  async startChangePatient(machineId: string) {
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });
    if (!machine) {
      throw new NotFoundException('Machine not found');
    }
    const ttl = parseInt(process.env.LOCK_TTL || '180000');
    const resource = `locks:machine:${machineId}`;
    const lockId = randomUUID();
    const lockAcquired = await this.redisClient.set(
      resource,
      lockId,
      'NX',
      'PX',
      ttl,
    );
    if (!lockAcquired) {
      throw new InternalServerErrorException(
        `Resource is already locked: ${resource}`,
      );
    }
    machine.status = MachineStatus.IN_TRANSFER;
    await this.machineRepo.save(machine);
    this.redisClient.publish('machines', JSON.stringify(machine));
    return {
      lockId: lockId,
      expiration: ttl,
    };
  }

  async changePatient(machineId: string, patient: string, lockId: string) {
    const lock = await this.redisClient.get(`locks:machine:${machineId}`);
    if (!lock) {
      throw new InternalServerErrorException('Lock not found or expired');
    }
    if (lock !== lockId) {
      throw new InternalServerErrorException('Invalid lock token');
    }
    try {
      const patientRecord = await this.patientRepo.findOne({
        where: { id: patient },
      });
      if (!patientRecord) {
        throw new NotFoundException('Patient not found');
      }
      const machine = await this.machineRepo.findOne({
        where: { id: machineId },
      });
      if (!machine) {
        this.redisClient.del(`locks:machine:${machineId}`);
        throw new NotFoundException('Machine not found');
      }
      const ogPatient = machine.assigned;
      machine.assigned = patient;
      machine.status = MachineStatus.USED;
      await this.machineRepo.save(machine);
      let machineActionDTO = new MachineActionDto(
        machineId,
        patient,
        `connected patient ${patient} to machine ${machine.name}`,
        MachineActionType.CONNECTED
      );
      let machineAction = this.machineActionRepo.create(machineActionDTO);
      await this.machineActionRepo.save(machineAction);
      if (ogPatient !== '') {
        machineActionDTO = new MachineActionDto(
          machineId,
          ogPatient,
          `disconnected patient ${ogPatient} from machine ${machine.name}`,
          MachineActionType.DISSCONNECET
        );
        machineAction = this.machineActionRepo.create(machineActionDTO);
        await this.machineActionRepo.save(machineAction);
        this.redisClient.publish('machines', JSON.stringify(machine));
      }
      await this.redisClient.del(`locks:machine:${machineId}`);
      return machine;
    } catch (err) {
      await this.redisClient.del(`locks:machine:${machineId}`);
      throw err;
    }
  }
}
