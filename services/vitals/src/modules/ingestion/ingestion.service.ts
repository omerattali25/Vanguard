import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientVitals, VitalEntity } from '@vanguard/types';
import { Repository } from 'typeorm';

@Injectable()
export class IngestionService {
  private batchBuffer: any[] = [];
  private readonly BATCH_THRESHOLD = 500;

  constructor(@InjectRepository(VitalEntity) private vitalRepository: Repository<VitalEntity>) { }

  async create(payload: PatientVitals) {
    this.batchBuffer.push(payload);

    // Only save when we hit the threshold
    if (this.batchBuffer.length >= this.BATCH_THRESHOLD) {
      await this.flushBatch();
    }
  }

  private async flushBatch() {
    const dataToInsert = [...this.batchBuffer];
    this.batchBuffer = []; // Clear immediately

    await this.vitalRepository
      .createQueryBuilder()
      .insert()
      .into(VitalEntity)
      .values(dataToInsert)
      .orIgnore()
      .execute();
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
        created_at: 'DESC'
      },
      take: limit
    })
  }
}
