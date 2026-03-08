import { PatientVitals } from "src/input/patient-vitals.input";

export const RegularVitalsBoundries : Record<keyof Omit<PatientVitals, 'id' | 'patinetId' | 'timestamp'>, {min: number; max: number}> = {
  heartRate: { min: 60, max: 100 },
  spO2: { min: 95, max: 100 },
  respiratoryRate: { min: 12, max: 20 },
  bodyTemperature: { min: 36, max: 37 },
};