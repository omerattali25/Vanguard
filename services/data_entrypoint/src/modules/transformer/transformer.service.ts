import { Inject, Injectable, Logger } from '@nestjs/common';
import { VitalsInput } from './inputs/vitals.input';
import { Vitals } from './outputs/vitals.output';
import { randomUUID } from 'crypto';
import { ClientKafka } from '@nestjs/microservices';
import { defaultMessage } from '../../config/default-messages.config';

@Injectable()
export class TransformerService {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  private logger = new Logger(TransformerService.name);

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('Kafka producer connected');
  }

  private changeInvalidValuesToMinusOne(vitals: Vitals) {
    this.logger.debug('Checking for invalid vital values');
    Object.keys(vitals).forEach((key) => {
      if (typeof vitals[key] === 'number' && vitals[key] < 0) {
        vitals[key] = -1;
      }
    });
  }

  handleVitals(message: VitalsInput) {
    if (message.patient_id === undefined) {
      this.logger.warn('Invalid patient ID provided');
      return;
    }

    const vitalsToReturn: Vitals = {
      ...defaultMessage,
      created_at: new Date().toISOString(),
      ...message,
      patient_id: message.patient_id + '',
      id: randomUUID(),
    };

    this.logger.debug(
      `Transformed vitals for patient ID ${vitalsToReturn.patient_id}: ${JSON.stringify(vitalsToReturn)}`,
    );
    this.changeInvalidValuesToMinusOne(vitalsToReturn);
    this.kafkaClient.emit(process.env.CREATE_TOPIC ?? '', vitalsToReturn);
  }
}
