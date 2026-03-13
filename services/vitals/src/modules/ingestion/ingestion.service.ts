import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';
import { Repository } from 'typeorm';

@Injectable()
export class IngestionService {
  constructor(@InjectRepository(VitalEntity) private vitalRepository: Repository<VitalEntity>) {}

  private logger = new Logger(IngestionService.name);

  async create(payload: VitalEntity): Promise<VitalEntity> {
    this.logger.log(`Adding vital for patient ${payload.patient_id}`);
    const vital = this.vitalRepository.create(payload);
    return this.vitalRepository.save(vital);
  }

  async getVitals(): Promise<VitalEntity[]> {
    this.logger.log('Fetching all vitals');
    return this.vitalRepository.find();
  }
  
  async getVitalById(id: string): Promise<VitalEntity | null> {
    this.logger.log(`Fetching vital by ID: ${id}`);
    const vital = await this.vitalRepository.findOneBy({ id });
    
    if (!vital) {
      this.logger.warn(`Vital with ID ${id} not found`);
      throw new NotFoundException('Vital not found');
    }
    return vital;
  }
  
  async getVitalByPatientId(patientId: string, limit: number = 100): Promise<VitalEntity[]> {
    this.logger.log(`Fetching vitals for patient ID: ${patientId} with limit: ${limit}`);
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
