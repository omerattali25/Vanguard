import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { VITALS_PACKAGE_NAME } from '@vanguard/proto';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: VITALS_PACKAGE_NAME,
      protoPath: join(
        require.resolve('@vanguard/proto'),
        '../..',
        'src/vitals/vitals.proto',
      ),
      url: `${process.env.VITALS_SERVICE_URL}:${process.env.VITALS_SERVICE_PORT}`,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID ?? '',
      },
    },
  });

  await app.startAllMicroservices();
  console.log('Vitals service is running (gRPC + Kafka)');
}
bootstrap();
