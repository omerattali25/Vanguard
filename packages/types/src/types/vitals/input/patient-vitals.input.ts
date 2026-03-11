import {IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export enum PatientVitalField {
    HEART_RATE = 'heartRate',
    SP_O2 = 'spO2',
    RESPIRATORY_RATE = 'respiratoryRate',
    BODY_TEMPERATURE = 'bodyTemperature',
}

export class PatientVitals{
    @IsUUID()
    id: string;

    @IsString()
    patientId: string;
    
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