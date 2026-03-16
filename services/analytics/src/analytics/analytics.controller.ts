import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { AnalyticsService, MachineUsageRanking } from './analytics.service';
import { MachineAction, Patient } from '@vanguard/types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get()
  getAllMachineActions(): Promise<MachineAction[]> {
    return this.analyticsService.getAllMachineActions();
  }

  @Get('machine-usage/:ranking')
  getMachineByUsageRanking(
    @Param('ranking', new ParseEnumPipe(MachineUsageRanking)) ranking: MachineUsageRanking): Promise<Patient | null> {
    return this.analyticsService.getMachineByUsageRanking(ranking);
  }
}
