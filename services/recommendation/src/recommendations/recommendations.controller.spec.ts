import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;
  let service: RecommendationsService;

  const mockRecommendationsService = {
    getTopRecommendations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        {
          provide: RecommendationsService,
          useValue: mockRecommendationsService,
        },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(
      RecommendationsController,
    );
    service = module.get<RecommendationsService>(RecommendationsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /recommendations', () => {
    it('should return recommendations from service', async () => {
      const mockData = { patient1: 0.9, patient2: 0.8 };
      mockRecommendationsService.getTopRecommendations.mockResolvedValue(
        mockData,
      );

      const result = await controller.getRecommendations();

      expect(result).toEqual(mockData);
      expect(service.getTopRecommendations).toHaveBeenCalledTimes(1);
    });

    it('should return empty object when no recommendations', async () => {
      mockRecommendationsService.getTopRecommendations.mockResolvedValue({});

      const result = await controller.getRecommendations();

      expect(result).toEqual({});
    });

    it('should propagate errors from service', async () => {
      mockRecommendationsService.getTopRecommendations.mockRejectedValue(
        new Error('Redis connection failed'),
      );

      await expect(controller.getRecommendations()).rejects.toThrow(
        'Redis connection failed',
      );
    });
  });
});
