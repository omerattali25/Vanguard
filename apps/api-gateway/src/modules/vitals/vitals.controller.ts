import { Controller, Get, Param, Query } from '@nestjs/common';
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
}
