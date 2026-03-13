import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { log } from 'console';

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

  private logger = new Logger(MachinesService.name);

  async getMachines(): Promise<Machine[]> {
    this.logger.log(`sent all the machines`)
    return await this.machineRepo.find();
  }
  async saveMachine(machineInput: MachineInputDto): Promise<Machine> {
    const newMachine = this.machineRepo.create(machineInput);
    const savedMachine = await this.machineRepo.save(newMachine);
    this.logger.log(`saved the machine ${savedMachine} to the db`)
    this.redisClient.publish('machines', JSON.stringify(savedMachine));
    this.logger.log(`published ${savedMachine}`)
    return savedMachine;
  }
  async updateMachine(id: string, machineUpdateDto: MachineUpdateDto) {
    const machine = await this.machineRepo.findOne({
      where: { id:id },
    });
    if (!machine){ 
      this.logger.error(`machine ${machine} wasent found`)
      return 'machine with this id not found';
    }
    machine.name = machineUpdateDto.name || machine.name;
    machine.location = machineUpdateDto.location || machine.location;
    await this.machineRepo.save(machine);
    this.logger.log(`upadeted machine ${machine}`)
    this.redisClient.publish('machines', JSON.stringify(machine));
    this.logger.log(`published ${machine}`)
  }

  async startChangePatient(machineId: string) {
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });
    if (!machine) {
      this.logger.error(`machine ${machine} wasent found`)
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
      this.logger.error(`Resource is already locked: ${resource}`)
      throw new InternalServerErrorException(
        `Resource is already locked: ${resource}`,
      );
    }
    this.logger.log(`lock machine ${machineId}`)
    machine.status = MachineStatus.IN_TRANSFER;
    await this.machineRepo.save(machine);
    this.logger.log(`changed machine status to in trasport in machine ${machineId}`)
    this.redisClient.publish('machines', JSON.stringify(machine));
    this.logger.log(`published machine ${machine}`)
    return {
      lockId: lockId,
      expiration: ttl,
    };
  }

  async changePatient(machineId: string, patient: string, lockId: string) {
    const lock = await this.redisClient.get(`locks:machine:${machineId}`);
    if (!lock) {
      this.logger.error(`{the lock ${lock} wasent found`)
      throw new InternalServerErrorException('Lock not found or expired');
    }
    if (lock !== lockId) {
      this.logger.error(`the recived lockId:${lockId} was not correct`)
      throw new InternalServerErrorException('Invalid lockId');
    }
    try {
      const patientRecord = await this.patientRepo.findOne({
        where: { id: patient },
      });
      if (!patientRecord) {
        this.logger.error(`the recived patient:${patient} wasnt found`)
        throw new NotFoundException('Patient not found');
      }
      const machine = await this.machineRepo.findOne({
        where: { id: machineId },
      });
      if (!machine) {
        this.logger.error(`the recived machine:${machineId} wasent found`)
        this.redisClient.del(`locks:machine:${machineId}`);
        throw new NotFoundException('Machine not found');
      }
      const ogPatient = machine.assigned;
      machine.assigned = patient;
      machine.status = MachineStatus.USED;
      await this.machineRepo.save(machine);
      this.logger.log(`updated machine ${machine}`)
      let machineActionDTO = new MachineActionDto(
        machineId,
        patient,
        `connected patient ${patient} to machine ${machine.name}`,
        MachineActionType.CONNECTED
      );
      let machineAction = this.machineActionRepo.create(machineActionDTO);
      this.logger.log(`saved machineAction:${machineAction} to db`)
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
        this.logger.log(`saved machineAction:${machineAction} to db`)
        this.redisClient.publish('machines', JSON.stringify(machine));
        this.logger.log(`published machine action:${machineAction}`)
      }
      await this.redisClient.del(`locks:machine:${machineId}`);
      this.logger.log(`released locks:machine:${machineId}`)
      return machine;
    } catch (err) {
      await this.redisClient.del(`locks:machine:${machineId}`);
      this.logger.log(`released locks:machine:${machineId}`)
      throw err;
    }
  }
}
