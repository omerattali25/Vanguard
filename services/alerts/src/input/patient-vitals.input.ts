import {IsDateString, IsNumber, IsUUID } from "class-validator";

export class PatientVitals{
    @IsUUID()
    id: string;

    @IsUUID()
    patinetId;
    
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