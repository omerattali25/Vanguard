import { NestFactory } from '@nestjs/core';
import {AverageCalculatorModule } from './average-calculator/average-calculator.module';
import { AverageCalculatorService } from './average-calculator/average-calculator.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AverageCalculatorModule);
  const workerService = app.get(AverageCalculatorService);

  const intervalMs = 60_000; // run every 60s, adjust as needed
  setInterval(() => workerService.runWorker(), intervalMs);

  console.log(`Worker started. Running every ${intervalMs / 1000}s`);
}

bootstrap();