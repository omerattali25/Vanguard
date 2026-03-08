import { ExceptionalAlertsService } from "../alerts/exceptional-alerts.service";
import { KafkaController } from "./kafka.consumer.controller";
import { Test, TestingModule } from "@nestjs/testing";

describe('KafkaController', () => {
  let controller: KafkaController;
  let service: ExceptionalAlertsService;

  const mockExceptionalAlertsService = {
    checkVitals: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KafkaController],
      providers: [
        {
          provide: ExceptionalAlertsService,
          useValue: mockExceptionalAlertsService,
        },
      ],
    }).compile();

    controller = module.get<KafkaController>(KafkaController);
    service = module.get<ExceptionalAlertsService>(ExceptionalAlertsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
