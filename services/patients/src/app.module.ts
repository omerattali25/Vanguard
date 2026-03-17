import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { db_patients_config } from './config/database.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redis_patients_config } from './config/redis.config';
import { ConfigModule } from '@nestjs/config/';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(db_patients_config),
    RedisModule.forRootAsync(redis_patients_config)
    , PatientsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
