import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService {
  constructor(private readonly client: ClientKafka) {}

  async consume(topic: string, callback: (message: any) => void) {
    await this.client.subscribeToResponseOf(topic);
    return this.client.on(topic, callback);
  }
}
