import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RecommendationsService {
  private readonly redis;
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '',
      port: parseInt(process.env.REDIS_PORT || '1'),
    });
  }

  async getTopRecommendations() {
    const raw = await this.redis.zrevrange(
      'riskIndex',
      0,
      parseInt(process.env.MAX_PATIENTS || '5'),
      'WITHSCORES',
    );
    return raw;
  }
}
