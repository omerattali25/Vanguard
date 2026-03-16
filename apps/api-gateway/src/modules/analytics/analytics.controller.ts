import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analitycs')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/machines')
  getMachinesAnalytics() {
    console.log('Received request to get all machines analytics');
    return this.analyticsService.getMachinesAnalytics();
  }
}
