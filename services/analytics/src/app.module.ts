import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics/analytics.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from './analytics/analytics.module';
import { Machine, MachineAction, Patient } from '@vanguard/types';

@Module({
  imports: [
    AnalyticsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || ''),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      autoLoadEntities: true,
      synchronize: true,
      entities: [MachineAction, Patient, Machine],
    }),
  ],
  controllers: [AnalyticsController],
  providers: [],
})
export class AppModule { }
