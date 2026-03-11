import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import loadConfig, { AppConfig } from './config/app';
import { VitalEntity } from '@vanguard/types';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redis_alerts_config } from './config/redis.config';
import { PagesStateModule } from './modules/pages-state/pages-state.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [loadConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => {
        const db = config.get<AppConfig['db']>('db');
        return {
          type: 'postgres' as const,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          entities: [VitalEntity],
          synchronize: true,
        };
      },
    }),
    RedisModule.forRootAsync(redis_alerts_config),
    IngestionModule,
    KafkaModule,
    PagesStateModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
