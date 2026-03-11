import { api } from "api/axios/axios";
import { Patient } from "types/patient";

export async function getPatients(): Promise<Patient[]> {
    const response = await api.get('/patients')
    return response.data;
}

export async function getPatientById(patientId: string): Promise<Patient> {
    const response = await api.get(`/patients/${patientId}`)
    return response.data;
}