import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineInputDto } from './dto/machine.input.dto';
import { MachineUpdateDto } from './dto/machine.update.dto';
import Redlock from 'redlock';

@Injectable()
export class MachinesService {
  
  constructor(
  @InjectRepository(Machine)
  private readonly machineRepo: Repository<Machine>,

  @Inject('REDLOCK')
  private readonly redlock: Redlock,
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
    const ttl = 5000; 
    try {
      const lock = await this.redlock.acquire([lockKey], ttl);
      if (lock) {
        const machine = await this.machineRepo.findOne({ where: { id } });
        if (!machine) {
          throw new Error('Machine not found');
        }
        machine.assinged = patient;
        await this.machineRepo.save(machine);
      } else {
        throw new Error('המכונה מועברת על ידי אחות אחרת');
      }
    } catch (error) {
      throw error;
    }
  }
}
