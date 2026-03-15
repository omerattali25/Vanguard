import { api } from "api/axios/axios";
import { Vital } from "types/vitals";

export async function getPatientAnalytics(patientId: string): Promise<[]> {
    const response = await api.get(`/analitycs/patients/${patientId}`)
    return response.data;
}
