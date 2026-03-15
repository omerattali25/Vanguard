import { Controller, Get, Param, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getPatients() {
    console.log('Received request to get all patients');
    return this.patientsService.getPatients();
  }

  @Get(':id')
  getPatientById(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }
}
