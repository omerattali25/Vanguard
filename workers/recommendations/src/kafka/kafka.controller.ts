import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Vital } from 'src/types/vitals.input';
import { RiskService } from './risk.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly riskService: RiskService) {}

  @EventPattern(process.env.KAFKA_TOPIC ?? '')
  async handleVitals(vitals: Vital) {
    await this.riskService.handleVitals(vitals);
  }
}
