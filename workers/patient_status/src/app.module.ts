import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { StatusWorkerModule } from './status-worker/status-worker.module';
import { db_patients_status_config } from './status-worker/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redis_status_config } from './status-worker/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(db_patients_status_config),
    RedisModule.forRootAsync(redis_status_config)
    , StatusWorkerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
