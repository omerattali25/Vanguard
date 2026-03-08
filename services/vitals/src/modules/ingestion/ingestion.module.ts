import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { KafkaModule } from 'src/modules/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
