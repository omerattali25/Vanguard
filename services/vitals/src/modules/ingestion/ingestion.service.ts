import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';
import { Repository } from 'typeorm';

@Injectable()
export class IngestionService {
  constructor(@InjectRepository(VitalEntity) private vitalRepository: Repository<VitalEntity>) {}

  async create(payload: VitalEntity): Promise<VitalEntity> {
    const vital = this.vitalRepository.create(payload);
    return this.vitalRepository.save(vital);
  }

  async getVitals(): Promise<VitalEntity[]> {
    return this.vitalRepository.find();
  }
  
  async getVitalById(id: string): Promise<VitalEntity | null> {
    const vital = await this.vitalRepository.findOneBy({ id });
    
    if (!vital) {
      throw new NotFoundException('Vital not found');
    }
    return vital;
  }
  
  async getVitalByPatientId(patientId: string, limit: number = 100): Promise<VitalEntity[]> {
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
