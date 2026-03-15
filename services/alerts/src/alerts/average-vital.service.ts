import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { PatientVitalField, PatientVitals, Timeframe, TIMEFRAMES, TTL_DAYS } from "@vanguard/types";


@Injectable()
export class AverageVitalService {
    private readonly redis: Redis

    constructor(
        private readonly redisService: RedisService,
    ) {
        this.redis = this.redisService.getOrThrow();
    }
    async isVitalOutOfAverage(vitals: PatientVitals, vitalField: PatientVitalField): Promise<boolean> {
        const timeframe = this.getTimeframe(vitals.created_at);
        if (!timeframe) return false;

        const formattedTimeframe = `${timeframe.start}-${timeframe.end}`;

        const promises: Promise<string | null>[] = []

        for (let i = 1; i <= TTL_DAYS; i++) {

            const date = new Date(vitals.created_at);
            date.setDate(date.getDate() - i);

            const day = date.toISOString().slice(0, 10);

            const key = `vital-average:${vitals.patient_id}:${day}:${formattedTimeframe}`;

            promises.push(this.redis.hget(key, vitalField));
        }
        const results = await Promise.all(promises);
        const values = results.filter(Boolean).map(Number);

        if (!values.length) return false;

        const avg =
            values.reduce((a, b) => a + b, 0) / values.length;

        const deviation = Math.abs(vitals[vitalField] - avg) / avg;

        return deviation > 0.2;
    }

    private getTimeframe(timestamp: string): Timeframe | undefined {

        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return undefined;
        }
        
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;

        return TIMEFRAMES.find(
            t => time >= t.start && time < t.end,
        );
    }
}