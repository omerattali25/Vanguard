import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bufferSize, PatientVitals, VitalEntity } from '@vanguard/types';
import { Repository } from 'typeorm';
import { PagesStateService } from '../pages-state/pages-state.service';

@Injectable()
export class IngestionService {
  private batchBuffer: PatientVitals[] = [];
  private readonly BATCH_THRESHOLD = bufferSize;

  private logger = new Logger(IngestionService.name);
  constructor(@InjectRepository(VitalEntity) private vitalRepository: Repository<VitalEntity>,
    private readonly pagesStateService: PagesStateService) { }

  async create(patientVitals: PatientVitals) {
    this.batchBuffer.push(patientVitals);
    this.logger.log(`Adding vital for patient ${patientVitals.patient_id}`);
    const vital = this.vitalRepository.create(patientVitals);
    this.pagesStateService.sendToRedisTopic(vital);

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
    this.logger.log('Fetching all vitals');
    return await this.vitalRepository.find();
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
    await this.pagesStateService.increment(patientId);
    this.logger.log(`Fetching vitals for patient ID: ${patientId} with limit: ${limit}`);
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
  async exitVitalByPatientId(patientId: string): Promise<void> {
    await this.pagesStateService.decrement(patientId);
  }
}
