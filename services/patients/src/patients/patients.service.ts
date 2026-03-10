import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Patient } from '../entity/patient.entity';
import { PatientDetails } from 'src/inputs/patient.input';
import { Repository } from 'typeorm';
import { not } from 'rxjs/internal/util/not';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
    ) {}

    async getPatientById(patient_id: string): Promise<Patient> {
        const patient = await this.patientRepo.findOne({ where: { id: patient_id } });
        if (!patient) {
            throw new NotFoundException(`Patient with ID ${patient_id} not found`);
        }
        return patient;
    }

    async getPatients(): Promise<Patient[]> {
        return await this.patientRepo.find();
    }

    async createPatient(patient: PatientDetails): Promise<Patient> {
        const newPatient = this.patientRepo.create(patient);
        return await this.patientRepo.save(newPatient);
    }

}
