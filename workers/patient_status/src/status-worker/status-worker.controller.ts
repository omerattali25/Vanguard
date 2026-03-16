import { Controller } from '@nestjs/common';
import { StatusWorkerService } from './status-worker.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PatientVitals } from '@vanguard/types';

@Controller()
export class StatusWorkerController {
  constructor(private readonly statusWorkerService: StatusWorkerService) {}

  @EventPattern(process.env.LISTEN_TOPIC)
  updatePatientVitalStatus(@Payload() patientVitals: PatientVitals) {
    void this.statusWorkerService.consumeVitals(patientVitals);
  }
}
