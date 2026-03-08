import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularVitalsBoundries } from 'src/config/regular-vitals.config';
import { Alert, VitalField } from 'src/entity/alert.entity';
import { PatientVitals } from 'src/input/patient-vitals.input';
import { Repository } from 'typeorm';

@Injectable()
export class ExceptionalAlertsService {
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

    async checkVitalField(vitals: PatientVitals, key : keyof PatientVitals) : Promise<Alert | null>{
        const bounds = RegularVitalsBoundries[key];
        const value = vitals[key];
        const vitalField = key as VitalField;

        const lastAlert = await this.GetLastAlertIfExists(vitals.patinetId, vitalField);
        if (value < bounds.min || value > bounds.max) {
            //exceptional vital
            if(!lastAlert || lastAlert.ended_at){
                //if there are no alerts or last alert already ended
                const newAlert = await this.createAlert(vitals, vitalField)
                return newAlert;
            }
        }
        else if(false){ //for future redis average check

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
    async GetLastAlertIfExists(patientId: string, vitalField: VitalField) : Promise<Alert | null> {
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
    async createAlert(vitals: PatientVitals, violation: VitalField) : Promise<Alert> {
        const alert : Omit<Alert, 'id'> = {
            patient_id: vitals.patinetId,
            vital_field: violation,
            description: `There was a violation in ${violation} vital`,
            started_at: vitals.timestamp,
            ended_at: null,
        }
        const newAlert = this.alertRepo.create(alert)
        return await this.alertRepo.save(newAlert)
    }
}
