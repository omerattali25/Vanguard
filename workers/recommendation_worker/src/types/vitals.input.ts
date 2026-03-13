import { IsPositive, IsString, IsNumber, IsUUID } from 'class-validator';

export class Vital {
  @IsUUID()
  id: string;

  @IsString()
  patient_id: string;

  @IsNumber()
  @IsPositive()
  respiratory_rate: number;

  @IsNumber()
  @IsPositive()
  spO2: number;
  heart_rate: number;
  body_temperature: number;
  created_at: string;
}
