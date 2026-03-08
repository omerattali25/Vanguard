import { Inject, Injectable } from '@nestjs/common';
import { VitalsBefore } from './inputs/vitals.input';
import { Vitals } from './outputs/vitals.input';
import { v4 } from 'uuid';
import { ClientKafka } from '@nestjs/microservices';
import { VitalsConfigured } from './config_types/DefaultValuesConfig';
import { defaults } from './config/default-messages.config';

const defaultMessageValues: VitalsConfigured = defaults;

@Injectable()
export class EntryPointService {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  private changeInvalidValuesToMinusOne(vitals: Vitals) {
    Object.keys(vitals).forEach((key) => {
      if (typeof vitals['key'] === 'number' && vitals['key'] < 0) {
        vitals[key] = -1;
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
    this.changeInvalidValuesToMinusOne(vitalsToReturn);
    this.kafkaClient.emit(process.env.CREATE_TOPIC ?? '', vitalsToReturn);
  }
}
