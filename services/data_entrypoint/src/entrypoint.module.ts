import * as dotenv from "dotenv"
dotenv.config();

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EntryPointController } from './entrypoint.controller';
import { EntryPointService } from './entrypoint.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'C:/Vanguard/services/data_entrypoint/.env',
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_PRODUCING || ''],
          },
        },
      },
    ]),
  ],
  controllers: [EntryPointController],
  providers: [EntryPointService],
})
export class AppModule {}
