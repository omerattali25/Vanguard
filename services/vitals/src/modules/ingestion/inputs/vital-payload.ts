import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVitalsInput {
  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @IsNotEmpty()
  heart_rate: number;

  @IsNotEmpty()
  respiratory_rate: number;

  @IsNotEmpty()
  body_temperature: number;

  @IsNotEmpty()
  spO2: number;

  @IsNotEmpty()
  @IsString()
  timestamp: string;
}