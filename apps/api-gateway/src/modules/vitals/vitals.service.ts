import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateVitalsInput, VitalEntity } from '@vanguard/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VitalsService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('VITALS_SERVICE_HOST', 'localhost');
    const port = this.configService.get('VITALS_SERVICE_PORT', 3001);
    this.baseUrl = `http://${host}:${port}`;
  }

  async getVitals(patientId: string, limit?: number): Promise<VitalEntity[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<VitalEntity[]>(`${this.baseUrl}/vitals/${patientId}`, {
        params: limit ? { limit } : {},
      }),
    );
    return data;
  }

  async recordVitals(payload: CreateVitalsInput): Promise<VitalEntity> {
    const { data } = await firstValueFrom(
      this.httpService.post<VitalEntity>(`${this.baseUrl}/vitals`, payload),
    );
    return data;
  }
}
