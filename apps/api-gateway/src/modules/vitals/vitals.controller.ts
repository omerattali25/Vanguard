import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateVitalsInput } from '@vanguard/types';
import { VitalsService } from './vitals.service';

@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Get(':patientId')
  getVitals(
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.vitalsService.getVitals(patientId, limit);
  }

  @Post()
  recordVitals(@Body() data: CreateVitalsInput) {
    return this.vitalsService.recordVitals(data);
  }
}
