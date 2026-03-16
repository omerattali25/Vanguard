import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Vital } from 'src/types/vitals.input';
import { RiskService } from './risk.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly riskService: RiskService) {}

  @EventPattern(process.env.KAFKA_TOPIC ?? 'updated_vitals')
  async handleVitals(vitals: Vital) {
    if(vitals.respiratory_rate < 0 || vitals.spO2 < 0){
      return;
    }
    await this.riskService.handleVitals(vitals);
  }
}
