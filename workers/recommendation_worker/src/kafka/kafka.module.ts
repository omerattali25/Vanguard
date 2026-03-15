import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { RiskService } from './risk.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [KafkaController],
  providers: [RiskService],
})
export class KafkaModule {}
