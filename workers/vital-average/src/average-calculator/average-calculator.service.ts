import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Vital } from '@libs/vitals';
import { VitalField } from '@libs/alerts';

import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

import { TIMEFRAMES, TTL_DAYS } from '../config/timeframes.config';

type Timeframe = {
  start: string;
  end: string;
};

@Injectable()
export class AverageCalculatorService {

  private readonly redis: Redis;

  constructor(
    @InjectRepository(Vital)
    private readonly vitalRepo: Repository<Vital>,

    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {

    const namespace = this.configService.get<string>('REDIS_NAMESPACE');
    this.redis = this.redisService.getOrThrow(namespace);

  }

  async calculateAndSaveAverage(timeframe: Timeframe) {

    const now = new Date();

    const [startH, startM] = timeframe.start.split(':').map(Number);
    const [endH, endM] = timeframe.end.split(':').map(Number);

    const startDate = new Date(now);
    startDate.setHours(startH, startM, 0, 0);

    const endDate = new Date(now);
    endDate.setHours(endH, endM, 0, 0);

    const vitals = await this.vitalRepo.find({
      where: {
        timestamp: Between(startDate, endDate),
      },
    });

    if (!vitals.length) return;

    const sums: Record<string, Record<VitalField, number>> = {};
    const counts: Record<string, Record<VitalField, number>> = {};

    for (const vital of vitals) {

      const patientId = vital.patientId;

      if (!sums[patientId]) {
        sums[patientId] = {} as Record<VitalField, number>;
        counts[patientId] = {} as Record<VitalField, number>;
      }
      for (const field of Object.values(VitalField) as VitalField[]) {
        const value = vital[field];

        if (value === undefined || value === null) {
          console.log(`Error recieving value for patinet: ${patientId} with vital field: ${field}`)

        }
        sums[patientId][field] = (sums[patientId][field] ?? 0) + vital.value;
        counts[patientId][field] = (counts[patientId][field] ?? 0) + 1;
      }
    }

    const today = now.toISOString().slice(0, 10);

    const averages: Record<string, Record<VitalField, number>> = {}

    for (const patientId in sums) {

      averages[patientId] = {} as Record<VitalField, number>;

      for (const field of Object.values(VitalField) as VitalField[]) {
        const sum = sums[patientId][field];
        const count = counts[patientId][field]
        
        if(!sum || !count) {
          console.log(`Error recieving sum and count for patinet: ${patientId} with vital field: ${field}`)
        }
      }

      const redisKey =
        `vital-average:${patientId}:${today}:${timeframe.start}-${timeframe.end}`;

      await this.redis.hset(redisKey, averages[patientId]);

      await this.redis.expire(redisKey, TTL_DAYS*24*60*60)
    }

    console.log(
      `Averages stored for timeframe ${timeframe.start}-${timeframe.end} of date ${today}`,
    );
  }
}
