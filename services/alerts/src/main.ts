import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configuration from "./config/alerts.config.json"
import { AlertsConfiguration } from './config/alerts.config';

async function bootstrap() {

  const config : AlertsConfiguration = configuration;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [config.kafkaListening],
        },
        consumer: {
          groupId: config.groupId,
        },
      },
    }
  );
}

bootstrap();
