import 'dotenv/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DataEntrypointModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(DataEntrypointModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER') ?? ''],
      },
      consumer: {
        groupId: 'transformer-consumer-group',
      },
    },
  });

  app.startAllMicroservices();
  await app.listen(process.env.DATA_ENTRYPOINT_SERVICE_PORT ?? 3004);
}

bootstrap();
