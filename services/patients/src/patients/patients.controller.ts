import { Controller, Get, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Get(':id')
    async getPatientById(@Param('id') id: string) {
        return await this.patientsService.getPatientById(id);
    }

    @Get()
    async getPatients() {
        return await this.patientsService.getPatients();
    }
}
