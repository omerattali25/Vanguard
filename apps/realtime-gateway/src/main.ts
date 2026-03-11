import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST ?? '',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    },
  });

  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    enableDebugMessages: true,
  });

  app.useGlobalPipes(pipe);
  microservice.useGlobalPipes(pipe);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
