import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineInputDto } from './dto/machine.input.dto';
import { MachineUpdateDto } from './dto/machine.update.dto';
import { randomUUID, UUID } from 'crypto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
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
        status: machineUpdateDto.status,
      },
    );
  }
  async startChangePatient(machineId: string) {
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
      const machine = await this.machineRepo.findOne({
        where: { id: machineId },
      });
      if (!machine) {
        this.redisClient.del(`locks:machine:${machineId}`);
        throw new NotFoundException('Machine not found');
      }
      machine.assigned = patient;
      await this.machineRepo.save(machine);
      await this.redisClient.del(`locks:machine:${machineId}`);
      return machine;
    } catch (err) {
      await this.redisClient.del(`locks:machine:${machineId}`);
      throw err;
    }
  }
}
