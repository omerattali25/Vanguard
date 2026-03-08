import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './entrypoint.module';
import { kafkaConfig } from "./kafka.config"


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,kafkaConfig);

  await app.listen();
}
bootstrap();