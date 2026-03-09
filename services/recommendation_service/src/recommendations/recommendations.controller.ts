import { Controller, Get } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}
  @Get()
  async getRecommendations() {
    let raw_data = await this.recommendationsService.getTopRecommendations();

    const entries = raw_data.reduce(
      (acc, val, i) => {
        if (i % 2 === 0) acc[val] = parseFloat(raw_data[i + 1]);
        return acc;
      },
      {} as Record<string, number>,
    );
    return entries;
  }
}
