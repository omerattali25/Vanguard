import { Inject, Injectable } from '@nestjs/common';
import { VitalsBefore } from './inputs/vitals.input';
import { Vitals } from './outputs/vitals.input';
import configuration from "./config/entrypoint.config.json"
import {AppConfiguration} from "./config_types/AppConfiguration"
import {v4} from "uuid"
import { ClientKafka } from '@nestjs/microservices';
import { VitalsConfigured } from './config_types/DefaultValuesConfig';
import messageconfig from "./config/default-messages.config.json"

const defaultMessageValues:VitalsConfigured =  messageconfig
const config:AppConfiguration = configuration;

@Injectable()
export class EntryPointService {
    constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

    async onModuleInit() {
    await this.kafkaClient.connect();  
  }
  
private changeInvalidValuesToMinusOne(vitals:Vitals){
  Object.keys(vitals).forEach(key => {
    if(!isNaN(vitals[key])&&vitals[key]<0){
      vitals[key] = -1
    }
});
}

handleVitals(message: VitalsBefore) {
  const vitalsToReturn: Vitals = {
    ...defaultMessageValues,
    created_at: new Date().toISOString(),
    ...message,
    id: v4(),
  };
  this.changeInvalidValuesToMinusOne(vitalsToReturn)

  this.kafkaClient.emit(config.createTopic, vitalsToReturn);
}  
}
