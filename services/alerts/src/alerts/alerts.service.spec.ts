import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlertsService } from './alerts.service';
import { Repository } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AverageVitalService } from './average-vital.service';
import { Alert, PatientVitalField, PatientVitals, RegularVitalsBoundries } from '@vanguard/types';

describe('AlertsService', () => {
  let service: AlertsService;
  let repo: Repository<Alert>;
  let redisMock: Redis;
  let averageVitalService: AverageVitalService;

  beforeEach(async () => {
    redisMock = {
      hget: jest.fn(),
      hset: jest.fn(),
      publish: jest.fn(),
    } as unknown as Redis;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: getRepositoryToken(Alert),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(redisMock),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('alerts'),
          },
        },
        {
          provide: AverageVitalService,
          useValue: {
            isVitalOutOfAverage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    repo = module.get<Repository<Alert>>(getRepositoryToken(Alert));
    averageVitalService = module.get<AverageVitalService>(AverageVitalService);

    (redisMock.hset as jest.Mock).mockResolvedValue('OK');
    (redisMock.publish as jest.Mock).mockResolvedValue(1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new alert if heartRate is irregular and no active alert in Redis', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '123',
      patient_id: 'p1',
      heart_rate: 120,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockImplementation(a => a);
    (repo.save as jest.Mock).mockResolvedValue({ ...vitals, id: 'a1', vital_field: PatientVitalField.HEART_RATE });

    const alerts = await service.checkVitals(vitals);

    expect(alerts.length).toBe(1);
    expect(alerts[0].vital_field).toBe(PatientVitalField.HEART_RATE);

    expect(redisMock.hset).toHaveBeenCalledWith(
      `recent-alerts:${vitals.patient_id}`,
      PatientVitalField.HEART_RATE,
      `ACTIVE:a1`
    );
  });

  it('should end previous alert if vital becomes normal and Redis shows ACTIVE', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '456',
      patient_id: 'p1',
      heart_rate: 80,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue('ACTIVE:a1');
    (repo.update as jest.Mock).mockResolvedValue({});

    const alerts = await service.checkVitals(vitals);

    expect(repo.update).toHaveBeenCalledWith('a1', { ended_at: vitals.created_at });

    expect(redisMock.hset).toHaveBeenCalledWith(
      `recent-alerts:${vitals.patient_id}`,
      PatientVitalField.HEART_RATE,
      vitals.created_at
    );

    expect(alerts.length).toBe(0);
  });

  it('should call isVitalOutOfAverage for each vital', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '789',
      patient_id: 'p1',
      heart_rate: 80,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue(null);

    await service.checkVitals(vitals);

    expect(averageVitalService.isVitalOutOfAverage)
      .toHaveBeenCalledTimes(Object.keys(RegularVitalsBoundries).length);
  });

  it('should not create alert if vitals are normal', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '111',
      patient_id: 'p1',
      heart_rate: 80,
      spO2: 98,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue(null);

    const alerts = await service.checkVitals(vitals);

    expect(repo.create).not.toHaveBeenCalled();
    expect(alerts.length).toBe(0);
  });

  it('should not create alert if one is already active in Redis', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '222',
      patient_id: 'p1',
      heart_rate: 120,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue('ACTIVE:a1');

    const alerts = await service.checkVitals(vitals);

    expect(repo.create).not.toHaveBeenCalled();
    expect(alerts.length).toBe(0);
  });

  it('should create new alert if previous alert ended', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '333',
      patient_id: 'p1',
      heart_rate: 120,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue('ENDED:a1');
    (repo.create as jest.Mock).mockImplementation(a => a);
    (repo.save as jest.Mock).mockResolvedValue({ ...vitals, id: 'a2' });

    const alerts = await service.checkVitals(vitals);

    expect(repo.create).toHaveBeenCalled();
    expect(alerts.length).toBe(1);
  });

  it('should generate correct description for out of bounds alert', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '444',
      patient_id: 'p1',
      heart_rate: 120,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockImplementation(a => a);
    (repo.save as jest.Mock).mockImplementation(alert => Promise.resolve({ ...alert, id: 'a2' }))

    const alerts = await service.checkVitals(vitals);

    expect(alerts[0].description).toContain('out of healthy bounds');
  });

  it('should create alert entity correctly', async () => {
    const vitals: PatientVitals = {
      id: '555',
      patient_id: 'p1',
      heart_rate: 120,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (repo.create as jest.Mock).mockImplementation(a => a);
    (repo.save as jest.Mock).mockResolvedValue({
      id: 'a1',
      patient_id: 'p1',
      vital_field: PatientVitalField.HEART_RATE,
    });

    const alert = await service.createNewAlert(
      vitals,
      PatientVitalField.HEART_RATE,
      `recent-alerts:${vitals.patient_id}`,
      true
    );

    expect(alert.patient_id).toBe('p1');
    expect(alert.vital_field).toBe(PatientVitalField.HEART_RATE);

    expect(redisMock.hset).toHaveBeenCalledWith(
      `recent-alerts:${vitals.patient_id}`,
      PatientVitalField.HEART_RATE,
      `ACTIVE:a1`
    );
  });

  it('should end last alert when vital becomes normal', async () => {
    jest.spyOn(averageVitalService, 'isVitalOutOfAverage').mockResolvedValue(false);

    const vitals: PatientVitals = {
      id: '666',
      patient_id: 'p1',
      heart_rate: 80,
      spO2: 97,
      respiratory_rate: 16,
      body_temperature: 36.5,
      created_at: new Date().toString(),
    };

    (redisMock.hget as jest.Mock).mockResolvedValue('ACTIVE:a1');
    (repo.update as jest.Mock).mockResolvedValue({});

    const alerts = await service.checkVitals(vitals);

    expect(repo.update).toHaveBeenCalledWith('a1', { ended_at: vitals.created_at });

    expect(redisMock.hset).toHaveBeenCalledWith(
      `recent-alerts:${vitals.patient_id}`,
      PatientVitalField.HEART_RATE,
      vitals.created_at
    );

    expect(alerts.length).toBe(0);
  });
});
