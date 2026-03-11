import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient, PatientVitals } from '@vanguard/types';
import { PatientStatusProvider } from './providers/patient-status-provider';

@Injectable()
export class StatusWorkerService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly patientStatusProvider: PatientStatusProvider,
  ) {}

  async consumeVitals(patientVital: PatientVitals) {
    await this.patientRepo.update(patientVital.id, {
      status: this.patientStatusProvider.providePatientStatus(patientVital),
    });
  }
}
