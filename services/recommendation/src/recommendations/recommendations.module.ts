import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '@vanguard/types';
import { Machine } from '@vanguard/types';

@Module({
  imports: [
    TypeOrmModule.forFeature([Machine]),
    TypeOrmModule.forFeature([Patient]),
  ],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
