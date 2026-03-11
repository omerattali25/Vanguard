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
  import { randomUUID, UUID } from 'crypto';
  import { MachineAction } from './entity/machine.action.entity';
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
      return await this.machineRepo.save(newMachine);
    }
    async updateMachine(machineUpdateDto: MachineUpdateDto) {
      const machine = await this.machineRepo.findOne({
        where: { id: machineUpdateDto.id },
      });
      if (!machine) return 'machine with this id not found';

      await this.machineRepo.update(
        { id: machineUpdateDto.id },
        {
          name: machineUpdateDto.name,
          location: machineUpdateDto.location,
        },
      );
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
      console.log(`Lock acquired for ${resource} with token ${lockId}`);
      machine.status=MachineStatus.IN_TRANSFER;
      await this.machineRepo.save(machine);
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
        machine.status=MachineStatus.USED;
        await this.machineRepo.save(machine);
        let machineActionDTO = new MachineActionDto(machineId, patient, `connected patient ${patient} to machine ${machine.name}`);
        let machineAction = this.machineActionRepo.create(machineActionDTO);
        await this.machineActionRepo.save(machineAction);
        if(ogPatient!== ''){
          machineActionDTO = new MachineActionDto(machineId, ogPatient, `disconnected patient ${ogPatient} from machine ${machine.name}`);
          machineAction = this.machineActionRepo.create(machineActionDTO);
          await this.machineActionRepo.save(machineAction);
        }
        await this.redisClient.del(`locks:machine:${machineId}`);
        return machine;
      } catch (err) {
        await this.redisClient.del(`locks:machine:${machineId}`);
        throw err;
      }
    }
  }
