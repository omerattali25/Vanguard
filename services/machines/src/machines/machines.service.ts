import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine, MachineStatus } from '@vanguard/types';
import { Repository } from 'typeorm';
import { MachineInputDto } from './dto/machine.input.dto';
import { MachineUpdateDto } from './dto/machine.update.dto';
import { randomUUID } from 'crypto';
import {
  MachineAction,
  MachineActionType,
} from '@vanguard/types';
import { MachineActionDto } from './dto/machine.action.dto';
import { Patient } from '@vanguard/types';
import { MachineOutputDto } from './dto/machine.output.dto';


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
  ) { }

  private logger = new Logger(MachinesService.name);

  async getMachines(): Promise<MachineOutputDto[]> {
    const machines = await this.machineRepo.find();

    return await Promise.all(
      machines.map(async (machine) => await this.convertPatientIdToName(machine)),
    );
  }

  async saveMachine(machineInput: MachineInputDto): Promise<Machine> {
    const newMachine = this.machineRepo.create(machineInput);
    const createdMachine = await this.machineRepo.save(newMachine);

    const outputMachine = await this.convertPatientIdToName(createdMachine);
    this.redisClient.publish('machines', JSON.stringify(outputMachine));

    return createdMachine;
  }

  async updateMachine(id: string, machineUpdateDto: MachineUpdateDto) {
    const machine = await this.machineRepo.findOne({
      where: { id: id },
    });

    if (!machine) {
      this.logger.error(`Machine: ${id} wasn't found`);
      throw new NotFoundException(`Machine: ${id} wasn't found`);
    }

    if (machineUpdateDto.name) {
      machine.name = machineUpdateDto.name;
    }

    if (machineUpdateDto.location) {
      machine.location = machineUpdateDto.location;
    }

    await this.machineRepo.save(machine);
    this.redisClient.publish('machines', JSON.stringify(machine));
  }

  async startChangePatient(machineId: string) {
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });

    if (!machine) {
      this.logger.error(`Machine: ${machineId} wasn't found`);
      throw new NotFoundException(`Machine: ${machineId} wasn't found`);
    }

    const ttl = parseInt(process.env.LOCK_TTL ?? '180000');
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
      this.logger.error(`Resource: ${resource} is already locked`);
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

    if (!lock || lock !== lockId) {
      this.logger.error(`The lock: ${lock} wasn't found or is not correct`);
      throw new InternalServerErrorException(`Lock: ${lock} wasn't found or is not correct`);
    }

    const patientRecord = await this.patientRepo.findOne({
      where: { id: patient },
    });

    if (!patientRecord) {
      this.logger.error(`The received patient: ${patient} wasn't found`);
      throw new NotFoundException(`Patient: ${patient} wasn't found`);
    }

    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });

    if (!machine) {
      this.logger.error(`The received machine: ${machineId} wasn't found`);
      this.redisClient.del(`locks:machine:${machineId}`);
      throw new NotFoundException(`Machine: ${machineId} wasn't found`);
    }

    const originalPatient = machine.assigned;
    machine.assigned = patient;
    machine.status = MachineStatus.USED;

    await this.machineRepo.save(machine);
    const machineWithPatientName = await this.convertPatientIdToName(machine);
    this.redisClient.publish('machines', JSON.stringify(machineWithPatientName));

    let machineActionDTO: MachineActionDto = {
      machine_id: machineId,
      patient_id: patient,
      description: `Connected patient: ${patient} to machine: ${machine.name}`,
      type: MachineActionType.CONNECTED,
    };

    let machineAction = this.machineActionRepo.create(machineActionDTO);
    await this.machineActionRepo.save(machineAction);

    if (originalPatient !== '') {
      machineActionDTO = {
        machine_id: machineId,
        patient_id: originalPatient,
        description: `Disconnected patient: ${originalPatient} from machine: ${machine.name}`,
        type: MachineActionType.DISCONNECTED
      };

      machineAction = this.machineActionRepo.create(machineActionDTO);
      await this.machineActionRepo.save(machineAction);
    }

    await this.redisClient.del(`locks:machine:${machineId}`);

    return machineWithPatientName;
  }

  async convertPatientIdToName(machine: Machine): Promise<MachineOutputDto> {
    if (machine.assigned === '') return machine;

    const patient = await this.patientRepo.findOne({
      where: { id: machine.assigned },
    });

    if (!patient) {
      this.logger.error(`Patient: ${machine.assigned} wasn't found`);
      throw new NotFoundException(`Patient: ${machine.assigned} wasn't found`);
    }

    return {
      name: machine.name,
      id: machine.id,
      location: machine.location,
      status: machine.status,
      assigned: patient.name,
    }
  }
}
