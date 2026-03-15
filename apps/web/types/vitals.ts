export interface Vital {
    id: string;
    patient_id: string;
    heart_rate: number;
    respiratory_rate: number;
    body_temperature: number;
    spO2: number;
    created_at: string;
}