import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MachineAction, Patient } from '@vanguard/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AnalyticsService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('ANALYTICS_SERVICE_HOST', 'localhost');
    const port = this.configService.get('ANALYTICS_SERVICE_PORT', 3011);
    this.baseUrl = `http://${host}:${port}`;
  }

  async getMachinesAnalytics(): Promise<MachineAction[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<MachineAction[]>(`${this.baseUrl}/analytics`),
    );
    return data;
  }

  async getMostConnectedPatient(): Promise<Patient> {
    const { data } = await firstValueFrom(
      this.httpService.get<Patient>(`${this.baseUrl}/analytics/machine-usage/DESC`),
    );
    return data;
  }

  async getLeastConnectedPatient(): Promise<Patient> {
    const { data } = await firstValueFrom(
      this.httpService.get<Patient>(`${this.baseUrl}/analytics/machine-usage/ASC`),
    );
    return data;
  }
}
