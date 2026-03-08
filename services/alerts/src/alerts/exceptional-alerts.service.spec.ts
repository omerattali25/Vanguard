import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionalAlertsService } from './exceptional-alerts.service';

describe('ExceptionalAlertsService', () => {
  let service: ExceptionalAlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionalAlertsService],
    }).compile();

    service = module.get<ExceptionalAlertsService>(ExceptionalAlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
