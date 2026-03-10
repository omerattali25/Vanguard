import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from 'src/entities/machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
