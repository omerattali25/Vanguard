import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vital } from '@libs/vitals';
import { AverageCalculatorService } from './average-calculator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vital])],
  providers: [AverageCalculatorService],
})
export class AverageCalculatorModule {}
