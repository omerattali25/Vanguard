import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { LoggerConfig } from '@vanguard/configurations';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: LoggerConfig,
  });

  app.enableCors({ origin: 'localhost:3000' });


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || ""],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || "",
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.startAllMicroservices();
  await app.listen(process.env.PATIENTS_SERVICE_PORT || 3002);
}
bootstrap();

