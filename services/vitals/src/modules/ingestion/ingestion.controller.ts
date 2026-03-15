import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { VitalEntity } from '@vanguard/types';

@Controller('vitals')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService)
  {}

  @Get()
  getVitals() {
    return this.ingestionService.getVitals();
  }

  @Get('/vital/:id')
  getVitalById(@Param('id') id: string) {
    return this.ingestionService.getVitalById(id);
  }

  @Get(':patientId')
  async getVitalByPatientId(
    @Param('patientId') patientId: string,
    @Query('limit') limit: number = 100
  ): Promise<VitalEntity[]> {
    return await this.ingestionService.getVitalByPatientId(patientId, limit);
  }

  @Post(':patientId/exit')
  async exitVitalByPatientId(@Param('patientId') patientId: string) {
    await this.ingestionService.exitVitalByPatientId(patientId);
  }

}

