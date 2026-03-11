import { Controller } from '@nestjs/common';
import { StatusWorkerService } from './status-worker.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PatientVitals } from '../inputs/patient-vitals';

@Controller('status-worker')
export class StatusWorkerController {
  constructor(private readonly statusWorkerService: StatusWorkerService) {}

  @EventPattern(process.env.KAFKA_LISTENING)
  updatePatientVitalStatus(@Payload() patientVitals: PatientVitals) {
    void this.statusWorkerService.consumeVitals(patientVitals);
  }
}
