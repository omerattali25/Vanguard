import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import configuration from './app.config.json';
import {AppConfiguration} from "./other_types/AppConfiguration"
import { AppController } from './app.controller';
import { AppService } from './app.service';


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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
