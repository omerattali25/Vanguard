import { Machine } from "@/types/machine";
import axios from "axios";

export async function getMachines(): Promise<Machine[]> {
    const response = await axios.get('/machines')
    return response.data;
}

export const createMachine = async (machineName: string) => {
    const response = await axios.post('/machines', { name: machineName })
    return response.data;
}

export const startChangePatient = async (machineId: string):Promise<string>=> {
    const response:ChangePatientResponse = await axios.post(`/machines/change-patient/${machineId}`)
    return response.lockId;
}
export const changePatient = async (machineId: string, patient: string, token: string) => {
    const response = await axios.put(`/machines/change-patient/${machineId}`, {  patient: patient, token: token})
    return response.data;
}
export interface ChangePatientResponse {
    lockId : string;
    expiration:number;

}