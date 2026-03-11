import axios from "axios";
import { Vital } from "types/vitals";

export async function getVitals(): Promise<Vital[]> {
    const response = await axios.get('/vitals')
    return response.data;
}

export async function getPatientVitals(patientId: string): Promise<Vital[]> {
    const response = await axios.get(`/vitals/${patientId}`)
    return response.data;
}
