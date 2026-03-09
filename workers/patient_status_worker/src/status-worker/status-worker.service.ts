import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusWorkerService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  consumeVitals(patientVital) {}
}
