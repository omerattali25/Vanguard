import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  VITALS_SERVICE_NAME,
} from '@vanguard/proto';
import type {
  VitalsServiceClient,
  GetVitalsRequest,
  GetVitalsResponse,
  RecordVitalsRequest,
  RecordVitalsResponse,
} from '@vanguard/proto';

@Injectable()
export class AppService implements OnModuleInit {
  private vitalsService: VitalsServiceClient;

  constructor(
    @Inject(VITALS_SERVICE_NAME) private readonly vitalsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.vitalsService =
      this.vitalsClient.getService<VitalsServiceClient>(VITALS_SERVICE_NAME);
  }

  async getVitals(patientId: string): Promise<GetVitalsResponse> {
    const request: GetVitalsRequest = { patientId };
    return firstValueFrom(this.vitalsService.getVitals(request));
  }

  async recordVitals(data: RecordVitalsRequest): Promise<RecordVitalsResponse> {
    return firstValueFrom(this.vitalsService.recordVitals(data));
  }
}
