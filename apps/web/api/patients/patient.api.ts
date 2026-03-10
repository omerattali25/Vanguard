import axios from "axios";
import { Patient } from "types/patient";

export async function getPatients(): Promise<Patient[]> {
    const response = await axios.get('/patients')
    return response.data;
}

export async function getPatientById(patientId: string): Promise<Patient> {
    const response = await axios.get(`/patients/${patientId}`)
    return response.data;
}