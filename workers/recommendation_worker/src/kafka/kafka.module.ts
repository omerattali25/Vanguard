import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { RiskService } from './risk.service';

@Module({
  controllers: [KafkaController],
  providers: [RiskService],
})
export class KafkaModule {}
