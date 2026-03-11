import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entity/patient.entity';
import { PatientVitals } from '../inputs/patient-vitals';

@Injectable()
export class StatusWorkerService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async consumeVitals(patientVital: PatientVitals) {
  }
}
