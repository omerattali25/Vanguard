import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';
import { AverageCalculatorService } from './average-calculator.service';

@Module({
  imports: [TypeOrmModule.forFeature([VitalEntity])],
  providers: [AverageCalculatorService],
})
export class AverageCalculatorModule {}
