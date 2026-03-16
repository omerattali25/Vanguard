import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsModule } from './alerts/alerts.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { db_alerts_config } from './config/database.config';
import { redis_alerts_config } from './config/redis.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync(db_alerts_config),
    RedisModule.forRootAsync(redis_alerts_config),
    AlertsModule,
  ],
})
export class AppModule { }
