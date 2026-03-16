import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [AnalyticsController],
  providers: [ AnalyticsService],
})
export class AppModule {}
