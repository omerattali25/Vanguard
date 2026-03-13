import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatusWorkerService } from './status-worker.service';
import { PatientStatusProvider } from './providers/patient-status-provider';
import { Patient, PatientStatus, PatientVitals } from '@vanguard/types';

describe('StatusWorkerService', () => {
  let service: StatusWorkerService;
  let repo: jest.Mocked<Repository<Patient>>;
  let provider: jest.Mocked<PatientStatusProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusWorkerService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: PatientStatusProvider,
          useValue: {
            providePatientStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(StatusWorkerService);
    repo = module.get(getRepositoryToken(Patient));
    provider = module.get(PatientStatusProvider);
  });

  it('should update patient status based on vitals', async () => {
    const vitals: PatientVitals = {
      id: 'patient-1',
      patientId: 'patient-1',
      heartRate: 80,
      spO2: 98,
      respiratoryRate: 15,
      bodyTemperature: 36.5,
      timestamp: new Date().toISOString(),
    };

    provider.providePatientStatus.mockReturnValue(PatientStatus.Stable);

    await service.consumeVitals(vitals);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(provider.providePatientStatus).toHaveBeenCalledWith(vitals);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).toHaveBeenCalledWith('patient-1', {
      status: PatientStatus.Stable,
    });
  });
});
