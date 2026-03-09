import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularVitalsBoundries } from '../config/regular-vitals.config';
import { Alert, VitalField } from './entity/alert.entity';
import { PatientVitals } from './input/patient-vitals.input';
import { Repository } from 'typeorm';


const DESCRIPTION_ON_OUT_OF_AVERAGE = "vital field is unstable compared to average."
const DESCRIPTION_ON_OUT_OF_BOUNDS = "vital field out of healthy bounds";

@Injectable()
export class AlertsService {
    constructor(
        @InjectRepository(Alert)
        private alertRepo: Repository<Alert>,
    ) { }

    async checkVitals(vitals: PatientVitals): Promise<Alert[]> {

        const tasks = (Object.keys(RegularVitalsBoundries) as (keyof PatientVitals)[])
            .map(key => this.checkVitalField(vitals, key));

        const results = await Promise.all(tasks);

        return results.filter((alert): alert is Alert => alert !== null);
    }

    async checkVitalField(vitals: PatientVitals, key: keyof PatientVitals): Promise<Alert | null> {
        const bounds = RegularVitalsBoundries[key];
        const value = vitals[key];
        const vitalField = key as VitalField;

        const lastAlert = await this.getLastAlertIfExists(vitals.patinetId, vitalField);
        const isInBounds = value >= bounds.min && value <= bounds.max;
        if (isInBounds && !(await this.isVitalOutOfAverage(value, vitalField))) {
            if (lastAlert && !lastAlert.ended_at) {
                this.alertRepo.update(lastAlert.id, { ended_at: vitals.timestamp })
            }
            return null;
        }
        if (!lastAlert || lastAlert.ended_at) {
            return await this.createNewAlert(vitals, vitalField, !isInBounds)
        }
        return null;
    }
    async isVitalOutOfAverage(vitalFieldValue: number, vitalField: VitalField): Promise<boolean> {
        return false;
    }
    async getLastAlertIfExists(patientId: string, vitalField: VitalField): Promise<Alert | null> {
        return await this.alertRepo.findOne({
            where: {
                patient_id: patientId,
                vital_field: vitalField,
            },
            order: {
                started_at: 'DESC',
            },
        })
    }
    async createNewAlert(vitals: PatientVitals, violation: VitalField, isOutOfBounds: boolean): Promise<Alert> {
        const description = (isOutOfBounds) ? DESCRIPTION_ON_OUT_OF_BOUNDS : DESCRIPTION_ON_OUT_OF_AVERAGE;

        const alert: Omit<Alert, 'id'> = {
            patient_id: vitals.patinetId,
            vital_field: violation,
            description: `${violation} ${description}`,
            started_at: vitals.timestamp,
            ended_at: null,
        }
        const newAlert = this.alertRepo.create(alert)
        return await this.alertRepo.save(newAlert)
    }
}
