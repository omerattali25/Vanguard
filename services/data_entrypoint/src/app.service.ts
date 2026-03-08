import { Inject, Injectable } from '@nestjs/common';
import { VitalsBefore } from './inputs/vitals.input';
import { Vitals } from './outputs/vitals.input';
import configuration from "./app.config.json"
import {AppConfiguration} from "./other_types/AppConfiguration"
import {v4} from "uuid"
import { ClientKafka } from '@nestjs/microservices';


const config:AppConfiguration = configuration;
@Injectable()
export class AppService {
    constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

    async onModuleInit() {
    await this.kafkaClient.connect();  
  }
  
  handleVitals(message:VitalsBefore){
    const vitalsToReturn:Vitals = {
      ...config.defaultMessageValues,
      created_at:new Date().toISOString(),
      ...message,
      id:v4(),
    }

    this.kafkaClient.emit(config.createTopic, vitalsToReturn);
  }   
}
