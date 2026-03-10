import {IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export class PatientVitals{
    @IsUUID()
    id: string;

    @IsString()
    patientId;
    
    @IsDateString()
    timestamp : string;

    @IsNumber()
    heartRate : number;

    @IsNumber()
    spO2 : number;
        
    @IsNumber()
    respiratoryRate : number;

    @IsNumber()
    bodyTemperature : number;

}