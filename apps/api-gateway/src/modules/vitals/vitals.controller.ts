import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VitalsService } from './vitals.service';

@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Get(':id')
  getVitals(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.vitalsService.getVitals(id, limit);
  }
  @Post(':id/exit')
  async exitVitals(@Param('id') id: string) {
    return await this.vitalsService.exitVitals(id);
  }
}
