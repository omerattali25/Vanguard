import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { MachineAction, Patient } from '@vanguard/types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAllMachineActions(): Promise<MachineAction[]> {
    return this.analyticsService.getAllMachineActions();
  }

  @Get('most-machine-usage')
  getPatientWithMostMachineUsage(): Promise<Patient | null> {
    return this.analyticsService.getPatientWithMostMachineUsage();
  }

  @Get('least-machine-usage')
  getPatientWithLeastMachineUsage(): Promise<Patient | null> {
    return this.analyticsService.getPatientWithLeastMachineUsage();
  }
}
