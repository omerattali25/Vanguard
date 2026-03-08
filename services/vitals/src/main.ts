import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { VITALS_PACKAGE_NAME } from '@vanguard/proto';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: VITALS_PACKAGE_NAME,
        protoPath: join(
          require.resolve('@vanguard/proto'),
          '..',
          'vitals/vitals.proto',
        ),
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
  console.log('Vitals gRPC microservice is running on 0.0.0.0:50051');
}
bootstrap();
