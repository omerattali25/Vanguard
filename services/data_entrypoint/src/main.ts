import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {AppConfiguration}  from "./other_types/AppConfiguration"
import configuration from "./app.config.json"


async function bootstrap() {

  let config:AppConfiguration = configuration;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [config.kafkaListening],
      },
      consumer: {
        groupId: config.groupId,
      },
    },
  });

  await app.listen();
}
bootstrap();