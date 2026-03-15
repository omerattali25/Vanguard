import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export enum PatientVitalField {
    HEART_RATE = 'heart_rate',
    SP_O2 = 'spO2',
    RESPIRATORY_RATE = 'respiratory_rate',
    BODY_TEMPERATURE = 'body_temperature',
}

export class PatientVitals {
  @IsUUID()
  id: string;

  @IsString()
  patient_id: string;
  
  @IsDateString()
  created_at : string;

  @IsNumber()
  heart_rate : number;

  @IsNumber()
  spO2 : number;
      
  @IsNumber()
  respiratory_rate : number;

  @IsNumber()
  body_temperature : number;
}
