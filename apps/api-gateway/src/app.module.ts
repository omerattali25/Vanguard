import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: VITALS_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: VITALS_PACKAGE_NAME,
          protoPath: join(
            require.resolve('@vanguard/proto'),
            '../..',
            'src/vitals/vitals.proto',
          ),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
