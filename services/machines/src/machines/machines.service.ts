import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineInputDto } from './dto/machine.input.dto';
import { MachineUpdateDto } from './dto/machine.update.dto';
const Redlock = require('redlock');

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @Inject('REDLOCK')
    private readonly redlock: any,
  ) {}

  async getMachines(): Promise<Machine[]> {
    return await this.machineRepo.find();
  }
  async saveMachine(machineInput: MachineInputDto): Promise<Machine> {
    const newMachine = this.machineRepo.create(machineInput);
    return await this.machineRepo.save(newMachine);
  }
  async updateMachine(machineUpdateDto: MachineUpdateDto) {
    const user = await this.machineRepo.findOne({
      where: { id: machineUpdateDto.id },
    });
    if (!user) return 'משתמש לא נמצא';

    await this.machineRepo.update(
      { id: machineUpdateDto.id },
      {
        name: machineUpdateDto.name,
        location: machineUpdateDto.location,
        status: machineUpdateDto.status,
      },
    );
  }
  async changePatient(id: string, patient: string) {
    const lockKey = `lock:resource:${id}`;
    let lock;
    const ttl = process.env.LOCK_TTL ? parseInt(process.env.LOCK_TTL) : 15000;
    try {
      lock = await this.redlock.lock(lockKey, ttl);

      if (lock) {
        const machine = await this.machineRepo.findOne({ where: { id } });
        if (!machine) {
          throw new NotFoundException(`Machine with id ${id} not found`);
        }
        machine.assigned = patient;
        await this.machineRepo.save(machine);
      } else {
        throw new Error('המכונה מועברת על ידי אחות אחרת');
      }
    } catch (error) {
      throw error;
    } finally {
      if (lock) {
        try {
          await lock.unlock();
        } catch (unlockError) {
          throw unlockError;
        }
      }
    }
  }
}
