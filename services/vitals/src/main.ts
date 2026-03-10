import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [config.getOrThrow<string>('kafka.brokers')],
      },
      consumer: {
        groupId: config.getOrThrow<string>('kafka.groupId'),
      },
    },
  });

  const port = config.getOrThrow<number>('env.port');

  app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
