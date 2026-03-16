import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Patient, PatientStatus, PatientVitals } from '@vanguard/types';
import { PatientStatusProvider } from './providers/patient-status-provider';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class StatusWorkerService implements OnModuleDestroy {
  private buffer: PatientVitals[] = [];
  private readonly redis: Redis;
  private isFlushing = false;

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly patientStatusProvider: PatientStatusProvider,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async consumeVitals(patientVital: PatientVitals) {
    this.buffer.push(patientVital);
    if (this.buffer.length >= 500 && !this.isFlushing) {
      this.flush();
    }
  }

  private async flush() {
    if (this.buffer.length === 0 || this.isFlushing) return;

    this.isFlushing = true;
    try {
      const batch = this.buffer.splice(0, this.buffer.length);

      const uniqueIds = [...new Set(batch.map((v) => String(v.patient_id)))];
      const redisKeys = uniqueIds.map((id) => `patient-status:${id}`);

      const cachedValues = await this.redis.mget(...redisKeys);
      const statusCache = new Map<string, string>();
      
      uniqueIds.forEach((id, index) => {
        statusCache.set(id, cachedValues[index] || PatientStatus.Stable);
      });

      const updatesByStatus: Record<string, Set<string>> = {};

      for (const vital of batch) {
        const id = String(vital.patient_id);
        const currentStatus = this.patientStatusProvider.providePatientStatus(vital);
        const lastStatus = statusCache.get(id);

        if (currentStatus !== lastStatus) {
          if (!updatesByStatus[currentStatus]) {
            updatesByStatus[currentStatus] = new Set();
          }
          updatesByStatus[currentStatus].add(id);
          
          statusCache.set(id, currentStatus);
        }
      }

      const statusesToUpdate = Object.entries(updatesByStatus);
      if (statusesToUpdate.length === 0) return;

      const updatePromises = statusesToUpdate.map(async ([status, idSet]) => {
        const ids = Array.from(idSet);

        await this.patientRepo
          .createQueryBuilder()
          .update(Patient)
          .set({ status: status as PatientStatus })
          .whereInIds(ids)
          .execute();

        const pipeline = this.redis.pipeline();
        ids.forEach((id) => {
          pipeline.set(`patient-status:${id}`, status, 'EX', 86400);
          pipeline.publish(`patient-status`, JSON.stringify({ patient_id: id, status }));
        });
        await pipeline.exec();
      });

      await Promise.all(updatePromises);
      console.log(`[StatusWorker] Flushed ${batch.length} vitals. Syncing ${statusesToUpdate.length} status groups.`);

    } catch (error) {
      console.error('[StatusWorker] Flush Error:', error);
    } finally {
      this.isFlushing = false;
      
      if (this.buffer.length >= 500) {
        this.flush();
      }
    }
  }

  async onModuleDestroy() {
    await this.flush();
  }
}