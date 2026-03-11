import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../../src/modules/ingestion/ingestion.service';
import { GetVitalsRequest, RecordVitalsRequest } from '@vanguard/proto';
import { IngestionController } from 'src/modules/ingestion/ingestion.controller';

describe('IngestionController', () => {
  let ingestionController: IngestionController;
  let ingestionService: IngestionService;

  beforeEach(async () => {
    const ingestionServiceMock = {
      getVitals: jest.fn(),
      recordVitals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: ingestionServiceMock,
        },
      ],
    }).compile();

    ingestionController = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  describe('getVitals', () => {
    it('should call ingestionService.getVitals with request and return the result', async () => {
      const req: GetVitalsRequest = { patientId: 'patient-test' };
      const expectedResult = {
        patientId: 'patient-test',
        heartRate: 75,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        temperature: 98.6,
        oxygenSaturation: 98,
        recordedAt: new Date().toISOString(),
      };
      (ingestionService.getVitals as jest.Mock).mockReturnValue(expectedResult);

      const result = ingestionController.getVitals(req);
      expect(ingestionService.getVitals).toHaveBeenCalledWith(req);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('recordVitals', () => {
    it('should call ingestionService.recordVitals with request and return the response', async () => {
      const req: RecordVitalsRequest = {
        patientId: 'patient-test',
        heartRate: 80,
        bloodPressureSystolic: 122,
        bloodPressureDiastolic: 85,
        temperature: 99,
        oxygenSaturation: 99,
      };
      const expectedResponse = {
        success: true,
        message: 'Vitals recorded for patient: patient-test',
        recordedAt: new Date().toISOString(),
      };
      (ingestionService.recordVitals as jest.Mock).mockReturnValue(
        expectedResponse,
      );

      const result = ingestionController.recordVitals(req);
      expect(ingestionService.recordVitals).toHaveBeenCalledWith(req);
      expect(result).toEqual(expectedResponse);
    });
  });
});
