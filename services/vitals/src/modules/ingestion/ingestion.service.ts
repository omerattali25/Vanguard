import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vital } from './entities/vital.entity';
import { Repository } from 'typeorm';
import { CreateVitalsInput } from './inputs/vital-payload';

@Injectable()
export class IngestionService {
  constructor(@InjectRepository(Vital) private vitalRepository: Repository<Vital>) {}

  async create(payload: CreateVitalsInput): Promise<Vital> {
    const vital = this.vitalRepository.create(payload);
    return this.vitalRepository.save(vital);
  }

  async getVitals(): Promise<Vital[]> {
    return this.vitalRepository.find();
  }
  
  async getVitalById(id: string): Promise<Vital | null> {
    const vital = await this.vitalRepository.findOneBy({ id });
    
    if (!vital) {
      throw new NotFoundException('Vital not found');
    }
    return vital;
  }
  
  async getVitalByPatientId(patientId: string, limit: number = 100): Promise<Vital[]> {
    return this.vitalRepository.find({
      where: {
        patient_id: patientId
      },
      order: {
        timestamp: 'DESC'
      },
      take: limit
    })
  }
}
