import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PatientDetails } from './inputs/patient.input';
import { PatientsService } from './patients/patients.service';

@Controller()
export class AppController {
  constructor(private readonly appService: PatientsService) {}


  @EventPattern("patients")
  handleNewPatient(@Payload() paitentMessage : PatientDetails){
    this.appService.savePatient(paitentMessage)
  }
 
}
