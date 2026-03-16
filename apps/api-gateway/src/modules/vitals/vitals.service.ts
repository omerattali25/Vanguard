import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { VitalEntity } from '@vanguard/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VitalsService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('VITALS_SERVICE_HOST', 'localhost');
    const port = this.configService.get('VITALS_SERVICE_PORT', 3003);
    this.baseUrl = `http://${host}:${port}`;
  }

  async getVitals(id: string, limit?: number): Promise<VitalEntity[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<VitalEntity[]>(`${this.baseUrl}/vitals/${id}`, {
        params: limit ? { limit } : {},
      }),
    );
    return data;
  }
  async exitVitals(id: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/vitals/${id}/exit`),
    );
  }
}
