import { NestFactory } from '@nestjs/core';
import { AverageCalculatorModule } from './average-calculator/average-calculator.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AverageCalculatorModule);
}

bootstrap();