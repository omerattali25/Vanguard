import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analitycs')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/machines')
  getMachinesAnalytics() {
    return this.analyticsService.getMachinesAnalytics();
  }
}
