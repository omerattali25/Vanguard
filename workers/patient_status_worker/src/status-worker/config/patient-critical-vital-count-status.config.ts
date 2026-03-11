import { PatientStatus } from '@vanguard/types';

export const PatientCriticalVitalCountStatus = [
  { status: PatientStatus.Stable, min: 0, max: 0 },
  { status: PatientStatus.Unstable, min: 1, max: 2 },
  { status: PatientStatus.Critical, min: 3, max: Infinity },
] satisfies readonly {
  status: PatientStatus;
  min: number;
  max: number;
}[];
