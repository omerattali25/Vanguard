import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { RecordVitalsRequest } from '@vanguard/proto';
import { AppService } from './app.service';

@Controller('vitals')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':patientId')
  getVitals(@Param('patientId') patientId: string) {
    return this.appService.getVitals(patientId);
  }

  @Post()
  recordVitals(@Body() data: RecordVitalsRequest) {
    return this.appService.recordVitals(data);
  }
}
