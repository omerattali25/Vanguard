import { Controller, Get } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}
  @Get()
  async getRecommendations() {
    let data = await this.recommendationsService.getTopRecommendations();

    return data;
  }
}
