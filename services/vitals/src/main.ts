import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerConfig } from '@vanguard/configurations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors({ origin: 'localhost:3000' });

  const config = app.get(ConfigService<AppConfig>);

  app.connectMicroservice<MicroserviceOptions>({

    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [config.get('kafka.broker', { infer: true }) as string],
      },
      consumer: {
        groupId: config.get('kafka.groupId', { infer: true }) as string,
      },
    },
  });

  const port = config.get<number>('env.port', { infer: true });

  app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
