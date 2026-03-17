import { Injectable } from '@nestjs/common';
import { Vital } from 'src/types/vitals.input';
import { Redis } from 'ioredis';
import { bufferSize } from '@vanguard/types';

@Injectable()
export class RiskService {
  private redis: Redis;
  private buffer: (string | number)[] = [];
  private readonly BATCH_SIZE = bufferSize;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    });
  }

  private calculateRisk(vitals: Vital): number {
    if (vitals.respiratory_rate === 0) return 10000;
    
    const roomOxygen = parseFloat(process.env.ROOM_OXYGEN_LEVEL ?? '0.21');
    return vitals.spO2 / roomOxygen / vitals.respiratory_rate;
  }

  async handleVitals(vitals: Vital) {
    const risk = this.calculateRisk(vitals);
    
    this.buffer.push(risk, vitals.patient_id);

    if (this.buffer.length >= this.BATCH_SIZE * 2) {
      await this.flush();
    }
  }

  private async flush() {
    const batch = this.buffer.splice(0, this.BATCH_SIZE * 2);
    
    try {
      await this.redis.zadd('riskIndex', ...batch);
    } catch (error) {
      console.error('Redis Batch Write Error:', error);
    }
  }
}