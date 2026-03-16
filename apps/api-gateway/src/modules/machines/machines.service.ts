import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Machine, Patient } from '@vanguard/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MachinesService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('MACHINES_SERVICE_HOST', 'localhost');
    const port = this.configService.get('MACHINES_SERVICE_PORT', 3005);
    this.baseUrl = `http://${host}:${port}`;
  }

  async getMachines(): Promise<Machine[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Machine[]>(`${this.baseUrl}/machines`),
    );
    return data;
  }

  async saveMachine(name: string): Promise<Machine> {
    const { data } = await firstValueFrom(
      this.httpService.post<Machine>(`${this.baseUrl}/machines`)
    );

    return data;
  }

  async updateMachine(location?: string, name?: string): Promise<Machine> {
    const { data } = await firstValueFrom(
      this.httpService.put<Machine>(`${this.baseUrl}/machines`)
    );
    return data
  }

  async startChangePatient(machineId: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.post<{ lockId: string, expiration: number }>(`${this.baseUrl}/machines/${machineId}`)
    )
    return data.lockId
  }

  async changePatient(machineId: string, patient_id: string, lockId: string): Promise<Machine> {
    const { data } = await firstValueFrom(
      this.httpService.put<Machine>(`${this.baseUrl}/machines/${machineId}`)
    )
    return data
  }

}
