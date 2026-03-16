import { api } from "api/axios/axios";
import { Vital } from "types/vitals";

export async function getVitals(): Promise<Vital[]> {
    const response = await api.get('/vitals')
    return response.data;
}

export async function getPatientVitals(patientId: string): Promise<Vital[]> {
    const response = await api.get(`/vitals/${patientId}`)
    return response.data;
}

export async function exitPatientVitals(patientId: string) : Promise<void> {
    await api.post(`/vitals/${patientId}/exit`);
}

