export class VitalsBefore{
    patient_id?:number;
    respiratory_rate?:number;
    spO2?:number;
    heart_rate?:number;
    body_temperature?:number;
    created_at?:string;
}

export interface VitalsConfigured{
    patient_id:number;
    respiratory_rate:number;
    spO2:number;
    heart_rate:number;
    body_temperature:number;
}