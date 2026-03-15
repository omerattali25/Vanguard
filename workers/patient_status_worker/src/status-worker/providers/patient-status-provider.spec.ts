import {
  PatientStatus,
  PatientVitals,
  RegularVitalsBoundries,
} from '@vanguard/types';
import { PatientStatusProvider } from './patient-status-provider';

describe('PatientStatusProvider', () => {
  let provider: PatientStatusProvider;

  const baseVitals: PatientVitals = {
    id: 'patient-1',
    patient_id: 'patient-1',
    heart_rate: 80,
    spO2: 98,
    respiratory_rate: 16,
    body_temperature: 36.5,
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    provider = new PatientStatusProvider();
  });

  it('should return Stable when all vitals are within bounds', () => {
    const result = provider.providePatientStatus(baseVitals);
    expect(result).toBe(PatientStatus.Stable);
  });

  it('should return Unstable when one vital is irregular', () => {
    const vitals = {
      ...baseVitals,
      heart_rate: RegularVitalsBoundries.heart_rate.max + 1,
    };

    const result = provider.providePatientStatus(vitals);

    expect(result).toBe(PatientStatus.Unstable);
  });

  it('should return Unstable when two vitals are irregular', () => {
    const vitals = {
      ...baseVitals,
      heartRate: RegularVitalsBoundries.heart_rate.max + 1,
      spO2: RegularVitalsBoundries.spO2.max + 1,
    };

    const result = provider.providePatientStatus(vitals);

    expect(result).toBe(PatientStatus.Unstable);
  });

  it('should return Critical when four or more vitals are irregular', () => {
    const vitals = {
      ...baseVitals,
      heartRate: RegularVitalsBoundries.heart_rate.max + 1,
      spO2: RegularVitalsBoundries.spO2.max + 1,
      respiratoryRate: RegularVitalsBoundries.respiratory_rate.max + 1,
      bodyTemperature: RegularVitalsBoundries.body_temperature.max + 1,
    };

    const result = provider.providePatientStatus(vitals);

    expect(result).toBe(PatientStatus.Critical);
  });
});
