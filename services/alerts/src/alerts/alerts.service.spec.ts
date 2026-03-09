import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlertsService } from './alerts.service';
import { Alert, VitalField } from './entity/alert.entity';
import { Repository } from 'typeorm';
import { PatientVitals } from './input/patient-vitals.input';
import { RegularVitalsBoundries } from '../config/regular-vitals.config';

describe('AlertsService', () => {
  let service: AlertsService;
  let repo: Repository<Alert>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
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

    service = module.get<AlertsService>(AlertsService);
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
    expect(alerts[0].vital_field).toBe(VitalField.HEART_RATE);
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

    const lastAlert = { id: 'a1', ended_at: null, patient_id: 'p1', vital_field: VitalField.HEART_RATE, started_at: new Date(), description: 'test' };
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

    const spy = jest.spyOn(service, 'isVitalOutOfAverage').mockResolvedValue(false);
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockImplementation(alert => alert);
    (repo.save as jest.Mock).mockResolvedValue({ ...vitals, id: 'a1' });

    await service.checkVitals(vitals);

    expect(spy).toHaveBeenCalledTimes(Object.keys(RegularVitalsBoundries).length);
  });

  it('should not create alert if vital is within bounds and not out of average', async () => {
    const vitals: PatientVitals = {
      id: "111",
      patinetId: 'p1',
      heartRate: 80,
      spO2: 98,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    (repo.findOne as jest.Mock).mockResolvedValue(null);
    jest.spyOn(service, 'isVitalOutOfAverage').mockResolvedValue(false);

    const alerts = await service.checkVitals(vitals);

    expect(repo.create).not.toHaveBeenCalled();
    expect(alerts.length).toBe(0);
  });
  it('should not create new alert if one is already active', async () => {
    const vitals: PatientVitals = {
      id: "222",
      patinetId: 'p1',
      heartRate: 120,
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    const lastAlert = {
      id: 'a1',
      patient_id: 'p1',
      vital_field: VitalField.HEART_RATE,
      started_at: new Date(),
      ended_at: null,
      description: 'test',
    };

    (repo.findOne as jest.Mock).mockResolvedValue(lastAlert);

    const alerts = await service.checkVitals(vitals);

    expect(repo.create).not.toHaveBeenCalled();
    expect(alerts.length).toBe(0);
  });
  it('should create new alert if previous alert ended', async () => {
    const vitals: PatientVitals = {
      id: "333",
      patinetId: 'p1',
      heartRate: 120,
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    const lastAlert = {
      id: 'a1',
      patient_id: 'p1',
      vital_field: VitalField.HEART_RATE,
      started_at: new Date(),
      ended_at: new Date(),
      description: 'old alert',
    };

    (repo.findOne as jest.Mock).mockResolvedValue(lastAlert);
    (repo.create as jest.Mock).mockImplementation(alert => alert);
    (repo.save as jest.Mock).mockResolvedValue({ id: 'a2' });

    const alerts = await service.checkVitals(vitals);

    expect(repo.create).toHaveBeenCalled();
    expect(alerts.length).toBe(1);
  });
  it('should generate correct description for out of bounds alert', async () => {
    const vitals: PatientVitals = {
      id: "444",
      patinetId: 'p1',
      heartRate: 120,
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    (repo.findOne as jest.Mock).mockResolvedValue(null);

    (repo.create as jest.Mock).mockImplementation(alert => alert);
    (repo.save as jest.Mock).mockImplementation(alert => Promise.resolve({ ...alert, id: 'a1' }));

    const alerts = await service.checkVitals(vitals);

    expect(alerts[0].description).toContain("out of healthy bounds");
  });

  it('should create alert entity correctly', async () => {
    const vitals: PatientVitals = {
      id: "555",
      patinetId: 'p1',
      heartRate: 120,
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    (repo.create as jest.Mock).mockImplementation(a => a);
    (repo.save as jest.Mock).mockImplementation(a => Promise.resolve({ ...a, id: 'a1' }));

    const alert = await service.createNewAlert(vitals, VitalField.HEART_RATE, true);

    expect(alert.patient_id).toBe('p1');
    expect(alert.vital_field).toBe(VitalField.HEART_RATE);
  });
  it('should end last alert with correct timestamp if vital becomes valid', async () => {
    const vitals: PatientVitals = {
      id: "333",
      patinetId: 'p1',
      heartRate: 80,
      spO2: 97,
      respiratoryRate: 16,
      bodyTemperature: 36.5,
      timestamp: new Date().toString(),
    };

    const lastAlert = {
      id: 'a1',
      patient_id: 'p1',
      vital_field: VitalField.HEART_RATE,
      started_at: new Date(),
      ended_at: null,
      description: 'old alert',
    };

    (repo.findOne as jest.Mock).mockResolvedValue(lastAlert);

    jest.spyOn(service, 'isVitalOutOfAverage').mockResolvedValue(false);

    const alerts = await service.checkVitals(vitals);

    expect(repo.update).toHaveBeenCalledWith('a1', {
      ended_at: vitals.timestamp,
    });

    expect(alerts.length).toBe(0);
  });

});
