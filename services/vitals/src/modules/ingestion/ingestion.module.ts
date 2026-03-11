import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalEntity } from '@vanguard/types';
import { PagesStateModule } from '../pages-state/pages-state.module';

@Module({
  imports: [PagesStateModule, TypeOrmModule.forFeature([VitalEntity])],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule { }
