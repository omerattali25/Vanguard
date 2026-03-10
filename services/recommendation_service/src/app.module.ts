import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ConfigModule } from '@nestjs/config';
import { Machine } from './entities/machine.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RecommendationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Machine],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
