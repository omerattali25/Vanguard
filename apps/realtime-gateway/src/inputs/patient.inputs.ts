import { IsEnum, IsString } from "class-validator";
import { PickType } from '@nestjs/mapped-types';

export enum PatientStatus {
    Stable = "stable",
    Unstable = "unstable",
    Critical = "critical",
}
export class PatientDetails {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsString()
    city: string;

    @IsEnum(PatientStatus)
    status: PatientStatus;

    @IsString()
    registered_at: string;

    @IsString()
    updated_at: string;
}

export class PatinetStatusUpdate extends PickType(PatientDetails, ['id', 'status'] as const) {}