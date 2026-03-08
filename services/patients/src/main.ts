import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppConfiguration } from './config/app-configurations';
import configuration from "./config/app.conf.json"

async function bootstrap() {
  let config : AppConfiguration = configuration;

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
  await app.listen();
}
bootstrap();

