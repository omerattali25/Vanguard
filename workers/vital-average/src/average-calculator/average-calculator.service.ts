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
    const startDate = this.parseTime(timeframe.start, now);
    const endDate = this.parseTime(timeframe.end, now);

    // 1. USE SQL AGGREGATION - This is the key change
    // We group by patientId and get averages for all fields in one query
    const query = this.vitalRepo.createQueryBuilder('v')
      .select('v.patientId', 'patientId')
      .where('v.timestamp BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('v.patientId');

    // Dynamically add AVG for each VitalField (HeartRate, SpO2, etc.)
    Object.values(VitalField).forEach(field => {
      query.addSelect(`AVG(v."${field}")`, `avg_${field}`);
    });

    const results = await query.getRawMany();

    if (!results.length) return;

    const today = now.toISOString().slice(0, 10);
    const pipeline = this.redis.pipeline(); // Use Pipeline for speed

    for (const row of results) {
      const { patientId, ...avgs } = row;
      const redisKey = `vital-average:${patientId}:${today}:${timeframe.start}-${timeframe.end}`;

      // Format averages for Redis (cleaning up "avg_" prefix from SQL result)
      const redisData: Record<string, string> = {};
      Object.keys(avgs).forEach(key => {
        const fieldName = key.replace('avg_', '');
        redisData[fieldName] = parseFloat(avgs[key]).toFixed(2);
      });

      pipeline.hset(redisKey, redisData);
      pipeline.expire(redisKey, TTL_DAYS * 24 * 60 * 60);
    }

    await pipeline.exec(); // Execute all Redis commands at once
    console.log(`Stored averages for ${results.length} patients.`);
  }

  private parseTime(timeStr: string, baseDate: Date): Date {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  }
}
