import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  async consume(topic: string, callback: (message: any) => void) {
    this.client.subscribeToResponseOf(topic);
    return this.client.on(topic, callback);
  }
}
