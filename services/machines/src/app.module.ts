import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { MachinesModule } from './machines/machines.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { LoggrModule } from './loggr/loggr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    LoggrModule

  ],
})
export class AppModule {}
