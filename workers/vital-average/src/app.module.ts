import { Module } from '@nestjs/common';
import { AverageCalculatorModule } from './average-calculator/average-calculator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db_vital_average_config } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redis_vital_average_config } from './config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(db_vital_average_config),
    RedisModule.forRootAsync(redis_vital_average_config),
    ScheduleModule.forRoot(),
    AverageCalculatorModule],
})
export class AppModule {}
