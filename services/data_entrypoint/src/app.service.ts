import { Injectable } from '@nestjs/common';
import { VitalsBefore } from './inputs/vitals.input';
import { Vitals } from './outputs/vitals.input';
import configuration from "./app.config.json"
import {AppConfiguration} from "./other_types/AppConfiguration"
import {v4} from "uuid"


const config:AppConfiguration = configuration;
@Injectable()
export class AppService {
  handleVitals(message:VitalsBefore){
    const vitalsToReturn:Vitals = {
      ...message,
      id:v4(),
      created_at:new Date().toISOString(),
      ...config.deafultMessageValues
    }
  }   
}
