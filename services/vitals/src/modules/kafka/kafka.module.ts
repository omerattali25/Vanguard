import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { KafkaConsumerController } from './kafka.consumer.controller';
@Module({
  imports: [IngestionModule],
  controllers: [KafkaConsumerController],
})

export class KafkaModule {}