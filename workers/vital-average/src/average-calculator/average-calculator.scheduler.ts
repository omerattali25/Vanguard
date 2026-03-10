import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TIMEFRAMES } from '../config/timeframes.config';
import { AverageCalculatorService } from './average-calculator.service';

@Injectable()
export class TimeframeScheduler {

  constructor(
    private readonly averageCalculatorService: AverageCalculatorService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkTimeframes() {

    const now = new Date();

    const bufferTime = new Date(now.getTime() - 60000)

    const hours = bufferTime.getHours().toString().padStart(2, '0');
    const minutes = bufferTime.getMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;

    const timeframe = TIMEFRAMES.find(t => t.end === time);

    if (!timeframe) return;

    await this.averageCalculatorService.calculateAndSaveAverage(timeframe);
  }
}