import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../../src/modules/ingestion/ingestion.service';
import { KafkaConsumerService } from '../../src/kafka/kafka.consumer-service';
import { GetVitalsRequest, RecordVitalsRequest } from '@vanguard/proto';

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let kafkaConsumerService: KafkaConsumerService;

  beforeEach(async () => {
    const kafkaConsumerServiceMock = {
      consume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: KafkaConsumerService,
          useValue: kafkaConsumerServiceMock,
        },
      ],
    }).compile();

    ingestionService = module.get<IngestionService>(IngestionService);
    kafkaConsumerService =
      module.get<KafkaConsumerService>(KafkaConsumerService);
  });

  describe('getVitals', () => {
    it('should call kafkaConsumerService.consume and return vitals data', () => {
      const request: GetVitalsRequest = { patientId: 'patient1' };
      const result = ingestionService.getVitals(request);

      expect(kafkaConsumerService.consume).toHaveBeenCalledWith(
        'vitals',
        expect.any(Function),
      );
      expect(result).toMatchObject({
        patientId: 'patient1',
        heartRate: expect.any(Number),
        bloodPressureSystolic: expect.any(Number),
        bloodPressureDiastolic: expect.any(Number),
        temperature: expect.any(Number),
        oxygenSaturation: expect.any(Number),
        recordedAt: expect.any(String),
      });
    });
  });

  describe('recordVitals', () => {
    it('should log and return a success response', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      const request: RecordVitalsRequest = {
        patientId: 'patient2',
        heartRate: 80,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 85,
        temperature: 99.2,
        oxygenSaturation: 97,
      };
      const response = ingestionService.recordVitals(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Recording vitals for patient:',
        'patient2',
      );
      expect(response).toMatchObject({
        success: true,
        message: expect.stringContaining('Vitals recorded for patient'),
        recordedAt: expect.any(String),
      });
      consoleSpy.mockRestore();
    });
  });
});
