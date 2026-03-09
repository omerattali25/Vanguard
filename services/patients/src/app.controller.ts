import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type {PatientDetails}  from './inputs/patient.input';
import { PatientsService } from './patients/patients.service';

@Controller()
export class AppController {
  constructor(private readonly appService: PatientsService) { }


  @EventPattern("patients")
  handleNewPatient(@Payload() paitentMessage: PatientDetails) {
    this.appService.createPatient(paitentMessage)
  }

}
