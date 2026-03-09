import { AlertsService } from "../alerts/alerts.service";
import { KafkaController } from "./kafka.consumer.controller";
import { Test, TestingModule } from "@nestjs/testing";

describe('KafkaController', () => {
  let controller: KafkaController;
  let service: AlertsService;

  const mockExceptionalAlertsService = {
    checkVitals: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KafkaController],
      providers: [
        {
          provide: AlertsService,
          useValue: mockExceptionalAlertsService,
        },
      ],
    }).compile();

    controller = module.get<KafkaController>(KafkaController);
    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
