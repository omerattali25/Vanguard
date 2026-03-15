import {
  PatientStatus,
  PatientVitals,
  RegularVitalsBoundries,
} from '@vanguard/types';
import { PatientCriticalVitalCountStatus } from '../config/patient-critical-vital-count-status.config';

type VitalKey = keyof Omit<PatientVitals, 'id' | 'patientId' | 'timestamp'>;

export class PatientStatusProvider {
  public providePatientStatus(vitals: PatientVitals) {
    const irregularVitalsCount = this.countIrregularVital(vitals);
    return this.getStatus(irregularVitalsCount);
  }

  private countIrregularVital(vitals: PatientVitals): number {
    return (Object.keys(RegularVitalsBoundries) as VitalKey[]).filter(
      (key) => !this.isVitalInBounds(key, vitals),
    ).length;
  }

  private isVitalInBounds(vitalKey: VitalKey, vitals: PatientVitals): boolean {
    const bounds = RegularVitalsBoundries[vitalKey];
    const vitalValue = vitals[vitalKey];
    return vitalValue >= bounds.min && vitalValue <= bounds.max;
  }

  private getStatus(vitalCount: number): PatientStatus {
    return PatientCriticalVitalCountStatus.find(
      (r) => vitalCount >= r.min && vitalCount <= r.max,
    )!.status;
  }
}
