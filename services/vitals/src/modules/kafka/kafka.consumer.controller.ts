import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { IngestionService } from "../ingestion/ingestion.service";
import { PatientVitals } from "@vanguard/types"

@Controller('kafka')
export class KafkaConsumerController {
  constructor(private readonly ingestionService: IngestionService) { }


  @EventPattern('updated_vitals')
  async handlePatientVitalConsume(@Payload() payload: PatientVitals) {


    return this.ingestionService.create(payload);
  }
}