import {
  IsString,
  IsDateString,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum VitalField {
  HEART_RATE = 'heart_rate',
  SP_O2 = 'spO2',
  RESPIRATORY_RATE = 'respiratory_rate',
  BODY_TEMPERATURE = 'body_temperature',
}

export class Alert {
  @IsUUID()
  id: string;

  @IsString()
  patient_id: string;

  @IsEnum(VitalField)
  vital_field: VitalField;

  @IsString()
  description: string;

  @IsDateString()
  created_at: string;

  @IsDateString()
  @IsOptional()
  ended_at?: string;
}
