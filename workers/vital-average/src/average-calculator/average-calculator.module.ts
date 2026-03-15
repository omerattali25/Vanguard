import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';
import { AverageCalculatorService } from './average-calculator.service';
import { TimeframeScheduler } from './average-calculator.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([VitalEntity])],
  providers: [AverageCalculatorService, TimeframeScheduler],
  exports: [AverageCalculatorService],
})
export class AverageCalculatorModule {}
