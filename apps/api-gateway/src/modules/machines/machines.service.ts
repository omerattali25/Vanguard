import { HttpException, Injectable } from '@nestjs/common';
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
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Machine[]>(`${this.baseUrl}/machines`),
      );
      return data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Machine service unavailable', 503);
    }
  }

  async saveMachine(name: string): Promise<Machine> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<Machine>(`${this.baseUrl}/machines`, {
          name: name,
        }),
      );

      return data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Machine service unavailable', 503);
    }
  }

  async updateMachine(
    id: string,
    name?: string,
    location?: string,
  ): Promise<Machine> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.put<Machine>(`${this.baseUrl}/machines/${id}`, {
          name: name,
          location: location,
        }),
      );
      return data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Machine service unavailable', 503);
    }
  }

  async startChangePatient(machineId: string): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ lockId: string; expiration: number }>(
          `${this.baseUrl}/machines/change-patient/${machineId}`,
        ),
      );
      return data.lockId;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Machine service unavailable', 503);
    }
  }

  async changePatient(
    machineId: string,
    patient_id: string,
    lockId: string,
  ): Promise<Machine> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.put<Machine>(
          `${this.baseUrl}/machines/change-patient/${machineId}`,
          { patient: patient_id, lockId: lockId },
        ),
      );
      return data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Machine service unavailable', 503);
    }
  }

  async exitChangePatient(machineId: string, lockId: string): Promise<Machine> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.put<Machine>(
          `${this.baseUrl}/machines/change-patient/exit/${machineId}`,
          { lockId: lockId },
        ),
      );
      return data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Machine service unavailable', 503);
    }
  }
}
