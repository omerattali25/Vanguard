import { Controller } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import {
  GetVitalsRequest,
  GetVitalsResponse,
  RecordVitalsRequest,
  RecordVitalsResponse,
  VitalsServiceController,
  VitalsServiceControllerMethods,
} from '@vanguard/proto';

@Controller('ingestion')
@VitalsServiceControllerMethods()
export class IngestionController implements VitalsServiceController {
  constructor(private readonly ingestionService: IngestionService) {}

  getVitals(data: GetVitalsRequest): GetVitalsResponse {
    return this.ingestionService.getVitals(data);
  }

  recordVitals(data: RecordVitalsRequest): RecordVitalsResponse {
    return this.ingestionService.recordVitals(data);
  }
}
