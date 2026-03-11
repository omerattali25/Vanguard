import { Test, TestingModule } from '@nestjs/testing';
import { AverageCalculatorService } from './average-calculator.service';

describe('AverageCalculatorService', () => {
  let service: AverageCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AverageCalculatorService],
    }).compile();

    service = module.get<AverageCalculatorService>(AverageCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
