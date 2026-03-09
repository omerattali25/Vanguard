import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { IngestionService } from "../ingestion/ingestion.service";
import { CreateVitalsInput } from "../ingestion/inputs/vital-payload";

@Controller('kafka')
export class KafkaConsumerController {
  constructor(private readonly ingestionService: IngestionService) { }

  @EventPattern('patient-vitals')
  async handlePatientVitalConsume(@Payload() payload: CreateVitalsInput) {
    //@ts-ignore
    console.log('Payload:', payload.data);
    //@ts-ignore
    return this.ingestionService.create(payload.data);
  }
}