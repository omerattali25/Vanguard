import { IsString } from "class-validator";

export class PatientDetails {
    @IsString()
    id: string;
    @IsString()
    name: string;
    @IsString()
    city: string;
}