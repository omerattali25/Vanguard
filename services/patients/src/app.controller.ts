import 'dotenv/config';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type {PatientDetails}  from './inputs/patient.input';
import { PatientsService } from './patients/patients.service';

@Controller()
export class AppController {
  constructor(private readonly appService: PatientsService) { }


  @EventPattern(process.env.LISTEN_TOPIC)
  async handleNewPatient(@Payload() paitentMessage: PatientDetails) {
    await this.appService.createPatient(paitentMessage)
  }

}
