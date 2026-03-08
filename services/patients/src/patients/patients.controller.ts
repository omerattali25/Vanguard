import { Controller, Get } from '@nestjs/common';
import { PatientsService } from './patients.service';
import type { UUID } from 'crypto';

@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Get(':id')
    async getPatientById(id: UUID) {
        return await this.patientsService.getPatientById(id);
    }

    @Get()
    async getPatients() {
        return await this.patientsService.getPatients();
    }
}
