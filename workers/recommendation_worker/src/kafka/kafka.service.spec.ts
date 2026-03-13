import { Test, TestingModule } from '@nestjs/testing';
import { RiskService } from './risk.service';

jest.mock('ioredis', () => {
  return {
    Redis: jest.fn().mockImplementation(() => ({
      zadd: jest.fn().mockResolvedValue(1),
    })),
  };
});

const mockVital = {
  id: 'v1',
  patient_id: 'p123',
  respiratory_rate: 16,
  spO2: 98,
  heart_rate: 72,
  body_temperature: 36.6,
  created_at: '2024-01-01T00:00:00Z',
};

describe('RiskService', () => {
  let service: RiskService;

  beforeEach(async () => {
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';
    process.env.roomOxygenLevel = '0.21';

    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskService],
    }).compile();

    service = module.get<RiskService>(RiskService);
  });

  describe('calculateRisk', () => {
    it('calculates correct risk score', () => {
      const risk = service['calculateRisk'](mockVital);
      const expected = 98 / 0.21 / 16;
      expect(risk).toBeCloseTo(expected);
    });

    it('increases risk when spO2 is higher', () => {
      const lowSpO2 = { ...mockVital, spO2: 90 };
      const highSpO2 = { ...mockVital, spO2: 99 };
      expect(service['calculateRisk'](highSpO2)).toBeGreaterThan(
        service['calculateRisk'](lowSpO2),
      );
    });

    it('decreases risk when respiratory_rate is higher', () => {
      const slowBreath = { ...mockVital, respiratory_rate: 10 };
      const fastBreath = { ...mockVital, respiratory_rate: 30 };
      expect(service['calculateRisk'](fastBreath)).toBeLessThan(
        service['calculateRisk'](slowBreath),
      );
    });

    it('handles division by zero when respiratory_rate is 0', () => {
      const vital = { ...mockVital, respiratory_rate: 0 };
      const risk = service['calculateRisk'](vital);
      expect(risk).toBe(10000);
    });
  });

  describe('handleVitals', () => {
    it('calls redis.zadd with correct args', () => {
      service.handleVitals(mockVital);
      const expectedRisk = 98 / 0.21 / 16;
      expect(service.redis.zadd).toHaveBeenCalledWith(
        'riskIndex',
        expectedRisk,
        'p123',
      );
    });

    it('calls redis.zadd once per vital', () => {
      service.handleVitals(mockVital);
      expect(service.redis.zadd).toHaveBeenCalledTimes(1);
    });
  });
});
