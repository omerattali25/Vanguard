import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppConfiguration } from './config/app-configurations';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_LISTENING || ""],
        },
        consumer: {
          groupId: process.env.GROUP_ID || "",
        },
      },
    }
  );
  await app.listen();
}
bootstrap();

