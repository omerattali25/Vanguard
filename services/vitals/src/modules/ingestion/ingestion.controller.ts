import { Controller, Get, Param, Query } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('vitals')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) { }

  @Get()
  getVitals() {
    return this.ingestionService.getVitals();
  }

  @Get('/vital/:id')
  getVitalById(@Param('id') id: string) {
    return this.ingestionService.getVitalById(id);
  }

  @Get(':patientId')
  getVitalByPatientId(
    @Param('patientId') patientId: string,
    @Query('limit') limit: number = 100
  ) {
    return this.ingestionService.getVitalByPatientId(patientId, limit);
  }
}

