import { IsString, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class Vitals {
  @IsUUID()
  id: string;

  @IsString()
  patient_id: string;

  @IsNumber()
  respiratory_rate: number;

  @IsNumber()
  spO2: number;

  @IsNumber()
  heart_rate: number;

  @IsNumber()
  body_temperature: number;

  @IsDateString()
  created_at: string;
}
