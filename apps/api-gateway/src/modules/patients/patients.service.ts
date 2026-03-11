import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Patient } from '@vanguard/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PatientsService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('PATIENTS_SERVICE_HOST', 'localhost');
    const port = this.configService.get('PATIENTS_SERVICE_PORT', 3002);
    this.baseUrl = `http://${host}:${port}`;
  }

  async getPatients(): Promise<Patient[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Patient[]>(`${this.baseUrl}/patients`),
    );
    return data;
  }

  async getPatientById(id: string): Promise<Patient> {
    const { data } = await firstValueFrom(
      this.httpService.get<Patient>(`${this.baseUrl}/patients/${id}`),
    );
    return data;
  }
}
