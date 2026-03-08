import { Controller } from "@nestjs/common";
import { KafkaConsumerService } from "./kafka.consumer.service";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";

@Controller('kafka')
export class KafkaConsumerController {
  constructor(private readonly kafkaConsumerService: KafkaConsumerService) { }

  @EventPattern(process.env.KAFKA_TOPIC)
  async handleVitalsConsume(
    @Ctx() context: KafkaContext,
  ) {
    const message = context.getMessage().value;
    console.log(message);
  }
}
