import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vital } from './entities/vital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vital])],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule { }
