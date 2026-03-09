import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { MachinesModule } from './machines/machines.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // 1. Load environment variables FIRST
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 4. Now initialize TypeORM
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || ''),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MachinesModule,
    RedisModule,
  ]
})
export class AppModule {}
