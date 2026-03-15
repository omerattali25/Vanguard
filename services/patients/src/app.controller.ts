import 'dotenv/config';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PatientDetails } from '@vanguard/types';
import { PatientsService } from './patients/patients.service';

@Controller()
export class AppController {
  constructor(private readonly appService: PatientsService) { }

  @EventPattern(process.env.LISTEN_TOPIC)
  async handleNewPatient(@Payload() paitentMessage: PatientDetails) {
    await this.appService.createPatient(paitentMessage)
  }

}
