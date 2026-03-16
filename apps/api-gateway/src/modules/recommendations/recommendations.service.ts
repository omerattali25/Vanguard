import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Recommendation } from '@vanguard/types';
@Injectable()
export class RecommendationsService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get(
      'RECOMMENDATIONS_SERVICE_HOST',
      'localhost',
    );
    const port = this.configService.get('RECOMMENDATIONS_SERVICE_PORT', 3007);
    this.baseUrl = `http://${host}:${port}`;
  }
  async getRecommendations() {
    const { data } = await firstValueFrom(
      this.httpService.get<Recommendation[]>(`${this.baseUrl}/recommendations`),
    );
    return data;
  }
}
