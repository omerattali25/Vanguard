import { Controller } from '@nestjs/common';
import { StatusWorkerService } from './status-worker.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('status-worker')
export class StatusWorkerController {
  constructor(private readonly statusWorkerService: StatusWorkerService) {
  }

  // TODO: Change to environment file variable
  @EventPattern('updated_vitals')
  async updatePatientVitalStatus(@Payload() patientVital) {
    this.statusWorkerService.consumeVitals(patientVital);
  }
}
