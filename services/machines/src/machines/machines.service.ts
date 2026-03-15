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
import {
  MachineAction,
  MachineActionType,
} from './entity/machine.action.entity';
import { MachineActionDto } from './dto/machine.action.dto';
import { Patient } from '@vanguard/types';
import { log } from 'console';
import { MachineOutputDto } from './dto/machine.output.dto';
import { threadId } from 'worker_threads';
import { machine } from 'os';

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

  async getMachines(): Promise<MachineOutputDto[]> {
    const machines = await this.machineRepo.find();
    const outputMachines = await Promise.all(
      machines.map((machine) => this.convertPatientIdToName(machine)),
    );
    return outputMachines;
  }
  async saveMachine(machineInput: MachineInputDto): Promise<Machine> {
    const newMachine = this.machineRepo.create(machineInput);
    const savedMachine = await this.machineRepo.save(newMachine);
    const outputMachine = await this.convertPatientIdToName(savedMachine);
    this.redisClient.publish('machines', JSON.stringify(outputMachine));
    return savedMachine;
  }
  async updateMachine(id: string, machineUpdateDto: MachineUpdateDto) {
    const machine = await this.machineRepo.findOne({
      where: { id: id },
    });
    if (!machine) {
      this.logger.error(`machine ${machine} wasent found`);
      return 'machine with this id not found';
    }
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
      this.logger.error(`machine ${machine} wasent found`);
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
      this.logger.error(`Resource is already locked: ${resource}`);
      throw new InternalServerErrorException(
        `Resource is already locked: ${resource}`,
      );
    }
    machine.status = MachineStatus.IN_TRANSFER;
    await this.machineRepo.save(machine);
    const outputMachine = await this.convertPatientIdToName(machine);
    this.redisClient.publish('machines', JSON.stringify(outputMachine));
    return {
      lockId: lockId,
      expiration: ttl,
    };
  }

  async changePatient(machineId: string, patient: string, lockId: string) {
    const lock = await this.redisClient.get(`locks:machine:${machineId}`);
    if (!lock) {
      this.logger.error(`{the lock ${lock} wasent found`);
      throw new InternalServerErrorException('Lock not found or expired');
    }
    if (lock !== lockId) {
      this.logger.error(`the recived lockId:${lockId} was not correct`);
      throw new InternalServerErrorException('Invalid lockId');
    }
    const patientRecord = await this.patientRepo.findOne({
      where: { id: patient },
    });
    if (!patientRecord) {
      this.logger.error(`the recived patient:${patient} wasnt found`);
      throw new NotFoundException('Patient not found');
    }
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });
    if (!machine) {
      this.logger.error(`the recived machine:${machineId} wasent found`);
      this.redisClient.del(`locks:machine:${machineId}`);
      throw new NotFoundException('Machine not found');
    }
    const ogPatient = machine.assigned;
    machine.assigned = patient;
    machine.status = MachineStatus.USED;
    await this.machineRepo.save(machine);
    const outputMachine = await this.convertPatientIdToName(machine);
    this.redisClient.publish('machines', JSON.stringify(outputMachine));
    let machineActionDTO = new MachineActionDto(
      machineId,
      patient,
      `connected patient ${patient} to machine ${machine.name}`,
      MachineActionType.CONNECTED,
    );
    let machineAction = this.machineActionRepo.create(machineActionDTO);
    await this.machineActionRepo.save(machineAction);
    if (ogPatient !== '') {
      machineActionDTO = new MachineActionDto(
        machineId,
        ogPatient,
        `disconnected patient ${ogPatient} from machine ${machine.name}`,
        MachineActionType.DISSCONNECET,
      );
      machineAction = this.machineActionRepo.create(machineActionDTO);
      await this.machineActionRepo.save(machineAction);
    }
    await this.redisClient.del(`locks:machine:${machineId}`);
    return outputMachine;
  }
  async convertPatientIdToName(machine: Machine): Promise<MachineOutputDto> {
    if (machine.assigned != '') {
      const patient = await this.patientRepo.findOne({
        where: { id: machine.assigned },
      });
      if (patient) {
        return new MachineOutputDto(
          machine.name,
          machine.id,
          machine.location,
          machine.status,
          patient.name,
        );
      }
      this.logger.error(`patient:${machine.assigned} wasnt found`);
      throw new NotFoundException(`patient:${machine.assigned} wasnt found`);
    }
    return machine;
  }
}
