import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VitalEntity } from '@vanguard/types';
import { Redis } from 'ioredis';
@Injectable()
export class PagesStateService {
    private readonly redis: Redis

    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {
        const namespace = this.configService.get<string>('REDIS_NAMESPACE');
        this.redis = this.redisService.getOrThrow(namespace);
    }

    async increment(patientId: string): Promise<void> {
        await this.redis.incr(`vitals-page:${patientId}`);
    }

    async decrement(patientId: string): Promise<void> {
        const count = await this.redis.decr(`vitals-page:${patientId}`);
        if (count <= 0) {
            await this.redis.del(`vitals-page:${patientId}`);
        }
    }
    async hasCount(patientId: string): Promise<boolean> {
        const count = await this.redis.get(`vitals-page:${patientId}`);
        return count !== null && parseInt(count) > 0;
    }
    async sendToRedisTopic(Vital: VitalEntity): Promise<void> {
        if(await this.hasCount(Vital.patient_id)) {
            await this.redis.publish(`vitals`, JSON.stringify(Vital));
        }
    }

}
