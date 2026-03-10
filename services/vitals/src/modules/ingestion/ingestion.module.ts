import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';

@Module({
  imports: [TypeOrmModule.forFeature([VitalEntity])],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule { }
