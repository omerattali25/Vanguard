import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularVitalsBoundries } from '@vanguard/types';
import { Alert, PatientVitalField } from '@vanguard/types';
import { PatientVitals } from "@vanguard/types";
import { Repository } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AverageVitalService } from './average-vital.service';


const DESCRIPTION_ON_OUT_OF_AVERAGE = "vital field is unstable compared to average."
const DESCRIPTION_ON_OUT_OF_BOUNDS = "vital field out of healthy bounds";

@Injectable()
export class AlertsService {
    private readonly redis: Redis
    private logger = new Logger(AlertsService.name);
    constructor(
        @InjectRepository(Alert)
        private alertRepo: Repository<Alert>,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly averageVitalService: AverageVitalService,
    ) {
        const namespace = this.configService.get<string>('REDIS_NAMESPACE');
        this.redis = this.redisService.getOrThrow(namespace);
    }

    async checkVitals(vitals: PatientVitals): Promise<Alert[]> {

        const tasks = (Object.keys(RegularVitalsBoundries) as (keyof PatientVitals)[])
            .map(key => this.checkVitalField(vitals, key));

        const results = await Promise.all(tasks);

        return results.filter((alert): alert is Alert => alert !== null);
    }

    async checkVitalField(vitals: PatientVitals, key: keyof PatientVitals): Promise<Alert | null> {
        const bounds = RegularVitalsBoundries[key];
        const value = vitals[key];
        const vitalField = key as PatientVitalField;
        const redisKey = `recent-alerts:${vitals.patientId}`

        const lastAlert = await this.redis.hget(redisKey, vitalField)
        const [lastAlertEndedAt, lastAlertId] = lastAlert?.split(':') ?? []

        const isInBounds = value >= bounds.min && value <= bounds.max;
        const hasViolation = !isInBounds || await this.averageVitalService.isVitalOutOfAverage(vitals, vitalField);

        if (!hasViolation) {
            this.logger.debug(`No violation for patient ${vitals.patientId} on vital field ${vitalField}. Value: ${value}`);
            if (lastAlert && lastAlertEndedAt === "ACTIVE") {
                await this.closeActiveAlert(vitals, vitalField, lastAlertId, redisKey)
            }
            return null;
        }
        if (!lastAlert || lastAlertEndedAt !== "ACTIVE") {
            return await this.createNewAlert(vitals, vitalField, redisKey, !isInBounds)
        }
        return null;
    }
    async createNewAlert(vitals: PatientVitals, violation: PatientVitalField, redisKey: string, isOutOfBounds: boolean): Promise<Alert> {


        const description = (isOutOfBounds) ? DESCRIPTION_ON_OUT_OF_BOUNDS : DESCRIPTION_ON_OUT_OF_AVERAGE;

        const alert: Omit<Alert, 'id'> = {
            patient_id: vitals.patientId,
            vital_field: violation,
            description: `${violation} ${description}`,
            started_at: vitals.timestamp,
            ended_at: null,
        }

        const newAlert = this.alertRepo.create(alert);
        const savedAlert = await this.alertRepo.save(newAlert);

        await this.redis.hset(redisKey, violation, `ACTIVE:${savedAlert.id}`);
        this.logger.debug(`Created new alert with ID ${savedAlert.id} for patient ${vitals.patientId} on vital field ${violation}. Value: ${vitals[violation]}`);
        return savedAlert;
    }
    private async closeActiveAlert(vitals: PatientVitals, vitalField: PatientVitalField, alertId: string, redisKey: string) {
        await this.redis.hset(redisKey, vitalField, vitals.timestamp);
        await this.alertRepo.update(alertId, { ended_at: vitals.timestamp })
        this.logger.debug(`Closed alert with ID ${alertId} for patient ${vitals.patientId} on vital field ${vitalField}. Value: ${vitals[vitalField]}`);
    }
}
