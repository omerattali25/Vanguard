import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import configuration from './app.config.json';
import {AppConfiguration} from "./config_types/AppConfiguration"
import { EntryPointController } from './entrypoint.controller';
import { EntryPointService } from './entrypoint.service';


const config:AppConfiguration = configuration;
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [config.kafkaProducing], 
          },
          producer: {},
        },
      },
    ]),
  ],
  controllers: [EntryPointController],
  providers: [EntryPointService],
})
export class AppModule {}
