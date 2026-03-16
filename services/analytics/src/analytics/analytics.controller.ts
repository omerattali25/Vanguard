import { Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Query } from '@nestjs/common';
import { AnalyticsService, MachineUsageRanking } from './analytics.service';
import { Machine, MachineAction, Patient } from '@vanguard/types';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAllMachineActions(): Promise<MachineAction[]> {
    return this.analyticsService.getAllMachineActions();
  }

  @Get('machine-usage/:ranking')
  getMachineByUsageRanking(
    @Param('ranking', new ParseEnumPipe(MachineUsageRanking)) ranking: MachineUsageRanking): Promise<Patient | null> {
    return this.analyticsService.getMachineByUsageRanking(ranking);
  }

  @Get('machine-usage/most-used-machine')
  getMostUsedMachine() {
    return this.analyticsService.getMostUsedMachine();
  }

  @Get('patients/new-per-day/:days')
  getNewPatientCountInLastDays(
    @Param('days', new ParseIntPipe()) days: number): Promise<Map<number, number>> {
    return this.analyticsService.getNewPatientCountInLastDays(days);
  }

  @Get('machines/most-actions/:days')
  getMachineWithMostActionsInLastDays(
    @Param('days', new ParseIntPipe()) days: number): Promise<Machine | null> {
    return this.analyticsService.getMachineWithMostActionsInLastDays(days);
  }
}
