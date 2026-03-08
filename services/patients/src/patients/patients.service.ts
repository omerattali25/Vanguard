import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Patient } from 'src/entity/patient.entity';
import { PatientDetails } from 'src/inputs/patient.input';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
    ) { }

    async getPatientById(patient_id: UUID): Promise<Patient> {
        let result = await this.patientRepo.findOne({ where: { id: patient_id } });
        if (!result) {
            throw new Error("Patient not found");
        }
        return result;
    }

    async getPatients(): Promise<Patient[]> {
        return await this.patientRepo.find();
    }

    async savePatient(patient: PatientDetails): Promise<Patient> {
        const newPatient = this.patientRepo.create(patient);
        return await this.patientRepo.save(newPatient);
    }

}
