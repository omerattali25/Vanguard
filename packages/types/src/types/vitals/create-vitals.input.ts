import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVitalsInput {
  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @IsNotEmpty()
  @IsNumber()
  heart_rate: number;

  @IsNotEmpty()
  @IsNumber()
  respiratory_rate: number;

  @IsNotEmpty()
  @IsNumber()
  body_temperature: number;

  @IsNotEmpty()
  @IsNumber()
  spO2: number;

  @IsNotEmpty()
  @IsString()
  timestamp: string;
}
