import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularVitalsBoundries } from '../config/regular-vitals.config';
import { Alert, VitalField } from '../entity/alert.entity';
import { PatientVitals } from '../input/patient-vitals.input';
import { Repository } from 'typeorm';

@Injectable()
export class ExceptionalAlertsService {
    constructor(
        @InjectRepository(Alert)
        private alertRepo: Repository<Alert>,
    ) { }

    private readonly DESCRIPTION_ON_OUT_OF_AVERAGE = "vital field is unstable compared to average."
    private readonly DESCRIPTION_ON_IRREGULAR = "vital field out of healthy bounds"

    async checkVitals(vitals: PatientVitals): Promise<Alert[]> {

        const tasks = (Object.keys(RegularVitalsBoundries) as (keyof PatientVitals)[])
            .map(key => this.checkVitalField(vitals, key));

        const results = await Promise.all(tasks);

        return results.filter((alert): alert is Alert => alert !== null);
    }

    async checkVitalField(vitals: PatientVitals, key : keyof PatientVitals) : Promise<Alert | null>{
        const bounds = RegularVitalsBoundries[key];
        const value = vitals[key];
        const vitalField = key as VitalField;

        const lastAlert = await this.getLastAlertIfExists(vitals.patinetId, vitalField);
        const isIrregular = value < bounds.min || value > bounds.max; 
        if (isIrregular || await this.checkOutOfAverage(vitals, vitalField)) {
            //exceptional vital
            if(!lastAlert || lastAlert.ended_at){
                //if there are no alerts or last alert already ended
                const newAlert = await this.createNewAlert(vitals, vitalField, isIrregular)
                return newAlert;
            }
        }
        else{
            //regular vital
            if(lastAlert && !lastAlert.ended_at){
                //didnt end yet, we update
                this.alertRepo.update(lastAlert.id, {ended_at: vitals.timestamp})
            }
        }
        return null;
    }
    async checkOutOfAverage(vitals : PatientVitals, vitalField : VitalField) : Promise<boolean> {
        return false;
    } 
    async getLastAlertIfExists(patientId: string, vitalField: VitalField) : Promise<Alert | null> {
        const lastAlert = await this.alertRepo.findOne({
            where: {
                patient_id: patientId,
                vital_field: vitalField,
            },
            order: {
                started_at: 'DESC',
            },
        })
        return lastAlert;
    }
    async createNewAlert(vitals: PatientVitals, violation: VitalField, isIrregular: boolean) : Promise<Alert> {
        const description = (isIrregular) ? this.DESCRIPTION_ON_IRREGULAR : this.DESCRIPTION_ON_OUT_OF_AVERAGE;

        const alert : Omit<Alert, 'id'> = {
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
