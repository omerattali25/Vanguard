import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { KafkaConsumerService } from './kafka.consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_HOST + ':' + process.env.KAFKA_PORT],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID ?? '',
          },
        },
      },
    ]),
  ],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})

export class KafkaModule {}