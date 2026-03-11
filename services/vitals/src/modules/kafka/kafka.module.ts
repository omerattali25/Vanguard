import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { KafkaConsumerController } from './kafka.consumer.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [IngestionModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [KafkaConsumerController],
})

export class KafkaModule {}