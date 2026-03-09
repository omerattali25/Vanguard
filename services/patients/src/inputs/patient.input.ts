import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PatientDetails {
    @IsNumber()
    patient_id: number;
    @IsString()
    name: string;
    @IsString()
    city: string;
}