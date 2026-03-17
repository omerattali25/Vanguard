import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analitycs')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/machines')
  getMachinesAnalytics() {
    return this.analyticsService.getMachinesAnalytics();
  }

  @Get('/all-stats/most-connected-patient')
  getMostConnectedPatient() {
    return this.analyticsService.getMostConnectedPatient();
  }

  @Get('/all-stats/least-connected-patient')
  getLeastConnectedPatient() {
    return this.analyticsService.getLeastConnectedPatient();
  }

  @Get('/all-stats/most-used-machine')
  getMostUsedMachine() {
    return this.analyticsService.getMostUsedMachine();
  }

  @Get('/all-stats/patients-per-day')
  getPatientsPerDay() {
    return this.analyticsService.getPatientsPerDay();
  }
}
