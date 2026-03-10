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
    const response = await axios.post(`/machines/change-patient`, { id:machineId})
    return response.data;
}
export const confirmChangePatient = async (machineId: string, patient: string, token: string) => {
    const response = await axios.post(`/machines/change-patient/confirm`, { id:machineId, patient: patient, token: token})
    return response.data;
}