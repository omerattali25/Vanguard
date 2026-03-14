import { PatientVitals } from "../vitals/input/patient-vitals.input";

export const RegularVitalsBoundries : Record<keyof Omit<PatientVitals, 'id' | 'patient_id' | 'created_at'>, {min: number; max: number}> = {
  heart_rate: { min: 60, max: 100 },
  spO2: { min: 95, max: 100 },
  respiratory_rate: { min: 12, max: 20 },
  body_temperature: { min: 36, max: 37 },
};