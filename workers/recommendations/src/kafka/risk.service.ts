import { Injectable } from '@nestjs/common';
import { Vital } from 'src/types/vitals.input';
import { Redis } from 'ioredis';

@Injectable()
export class RiskService {
  redis: Redis;
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? '',
      port: parseInt(process.env.REDIS_PORT ?? '1'),
    });
  }

  private calculateRisk(vitals: Vital): number {
    if (vitals.respiratory_rate === 0) {
      return 10000; // THE MAN IS NOT BREATHING, HE IS DEAD, GIVE HIM A HIGH RISK SCORE
    }
    return (
      vitals.spO2 /
      parseFloat(process.env.ROOM_OXYGEN_LEVEL ?? '0.21') /
      vitals.respiratory_rate
    );
  }

  handleVitals(vitals: Vital) {
    const risk = this.calculateRisk(vitals);
    this.redis.zadd('riskIndex', risk, vitals.patient_id);
  }
}
