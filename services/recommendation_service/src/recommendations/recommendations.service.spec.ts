import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecommendationsService } from './recommendations.service';
import { Machine } from '../entities/machine.entity';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    zrevrange: jest.fn(),
  }));
});

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let redisMock: { zrevrange: jest.Mock };

  const mockMachineRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Machine),
          useValue: mockMachineRepo,
        },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
    redisMock = (service as any).redis;
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTopRecommendations', () => {
    it('should return filtered patients with risk scores', async () => {
      redisMock.zrevrange.mockResolvedValue([
        'p1',
        '0.9',
        'p2',
        '0.8',
        'p3',
        '0.7',
      ]);
      mockMachineRepo.find.mockResolvedValue([{ assigned: 'p2' }]);

      const result = await service.getTopRecommendations();

      expect(result).toEqual({ p1: 0.9, p3: 0.7 });
    });

    it('should return all patients when no machines are assigned', async () => {
      redisMock.zrevrange.mockResolvedValue(['p1', '0.9', 'p2', '0.8']);
      mockMachineRepo.find.mockResolvedValue([]);

      const result = await service.getTopRecommendations();

      expect(result).toEqual({ p1: 0.9, p2: 0.8 });
    });

    it('should return empty object when all patients are assigned to machines', async () => {
      redisMock.zrevrange.mockResolvedValue(['p1', '0.9', 'p2', '0.8']);
      mockMachineRepo.find.mockResolvedValue([
        { assigned: 'p1' },
        { assigned: 'p2' },
      ]);

      const result = await service.getTopRecommendations();

      expect(result).toEqual({});
    });

    it('should return empty object when redis returns no data', async () => {
      redisMock.zrevrange.mockResolvedValue([]);
      mockMachineRepo.find.mockResolvedValue([]);

      const result = await service.getTopRecommendations();

      expect(result).toEqual({});
    });

    it('should call redis with correct args', async () => {
      process.env.MAX_PATIENTS = '3';
      redisMock.zrevrange.mockResolvedValue([]);
      mockMachineRepo.find.mockResolvedValue([]);

      await service.getTopRecommendations();

      expect(redisMock.zrevrange).toHaveBeenCalledWith(
        'riskIndex',
        0,
        3,
        'WITHSCORES',
      );
    });
  });
});
