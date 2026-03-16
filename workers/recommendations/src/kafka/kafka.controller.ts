import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';
import { Vital } from 'src/types/vitals.input';
import { RiskService } from './risk.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly riskService: RiskService) {}

  @EventPattern(process.env.KAFKA_TOPIC ?? 'updated_vitals')
  async handleVitals(@Payload() vitals: Vital) {
    try {
      await this.riskService.handleVitals(vitals);
    } catch (err) {
      if (err instanceof BadRequestException) {
        return;
      }
      throw err;
    }
  }
}
