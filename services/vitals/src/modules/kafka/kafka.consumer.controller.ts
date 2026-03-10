import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { IngestionService } from "../ingestion/ingestion.service";
import { CreateVitalsInput } from "@vanguard/types";

@Controller('kafka')
export class KafkaConsumerController {
  constructor(
    private readonly ingestionService: IngestionService) { }

  @EventPattern(process.env.KAFKA_TOPIC)
  async handlePatientVitalConsume(@Payload() payload: CreateVitalsInput) {
    //@ts-ignore
    console.log('Payload:', payload.data);
    //@ts-ignore
    return this.ingestionService.create(payload.data);
  }
}