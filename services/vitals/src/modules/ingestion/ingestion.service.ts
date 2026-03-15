import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';
import { Repository } from 'typeorm';
import { PagesStateService } from '../pages-state/pages-state.service';

@Injectable()
export class IngestionService {
  constructor(@InjectRepository(VitalEntity) private vitalRepository: Repository<VitalEntity>,
  private readonly pagesStateService: PagesStateService) { }

  async create(payload: VitalEntity): Promise<VitalEntity> {
    const vital = this.vitalRepository.create(payload);
    this.pagesStateService.sendToRedisTopic(vital);
    return await this.vitalRepository.save(vital);
  }

  async getVitals(): Promise<VitalEntity[]> {
    return await this.vitalRepository.find();
  }

  async getVitalById(id: string): Promise<VitalEntity | null> {
    const vital = await this.vitalRepository.findOneBy({ id });

    if (!vital) {
      throw new NotFoundException('Vital not found');
    }
    return vital;
  }

  async getVitalByPatientId(patientId: string, limit: number = 100): Promise<VitalEntity[]> {
    await this.pagesStateService.increment(patientId);
    return await this.vitalRepository.find({
      where: {
        patient_id: patientId
      },
      order: {
        timestamp: 'DESC'
      },
      take: limit
    })
  }
  async exitVitalByPatientId(patientId: string): Promise<void> {
    await this.pagesStateService.decrement(patientId);
  }
}
