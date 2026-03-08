import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExceptionalAlertsService } from './exceptional-alerts.service';
import { Alert, VitalField } from '../entity/alert.entity';
import { Repository } from 'typeorm';
import { PatientVitals } from '../input/patient-vitals.input';
import { RegularVitalsBoundries } from '../config/regular-vitals.config';

describe('ExceptionalAlertsService', () => {
  let service: ExceptionalAlertsService;
  let repo: Repository<Alert>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExceptionalAlertsService,
        {
          provide: getRepositoryToken(Alert),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExceptionalAlertsService>(ExceptionalAlertsService);
    repo = module.get<Repository<Alert>>(getRepositoryToken(Alert));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a new alert if heartRate is irregular', async () => {
    const vitals: PatientVitals = {
      id: "123",
      patinetId: 'p1',
      heartRate: 120, // irregular
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    // Mock no previous alert
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockImplementation(alert => alert);
    (repo.save as jest.Mock).mockImplementation(alert => Promise.resolve({ ...alert, id: 'a1' }));

    const alerts = await service.checkVitals(vitals);

    expect(alerts.length).toBe(1);
    expect(alerts[0].vital_field).toBe(VitalField.HeartRate);
  });
  it('should end previous alert if vital is now regular', async () => {
    const vitals: PatientVitals = {
      id: "456",
      patinetId: 'p1',
      heartRate: 80, // normal
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    const lastAlert = { id: 'a1', ended_at: null, patient_id: 'p1', vital_field: VitalField.HeartRate, started_at: new Date(), description: 'test' };
    (repo.findOne as jest.Mock).mockResolvedValue(lastAlert);
    (repo.update as jest.Mock).mockResolvedValue({});

    const alerts = await service.checkVitals(vitals);

    expect(repo.update).toHaveBeenCalledWith('a1', { ended_at: vitals.timestamp });
    expect(alerts.length).toBe(0);
  });
  it('should call checkOutOfAverage for each vital', async () => {
    const vitals: PatientVitals = {
      id: "789",
      patinetId: 'p1',
      heartRate: 80,
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    const spy = jest.spyOn(service, 'checkOutOfAverage').mockResolvedValue(false);
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockImplementation(alert => alert);
    (repo.save as jest.Mock).mockResolvedValue({ ...vitals, id: 'a1' });

    await service.checkVitals(vitals);

    expect(spy).toHaveBeenCalledTimes(Object.keys(RegularVitalsBoundries).length);
  });



});
