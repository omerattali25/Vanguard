import { Machine } from "@/types/machine";
import { notifyManager } from "@tanstack/react-query";
import { api } from "api/axios/axios";

export async function getMachines(): Promise<Machine[]> {
    const response = await api.get('/machines')
    return response.data;
}

export const createMachine = async (machineName:string) => {
    const response = await api.post('/machines', { name: machineName })
    return response.data;
}

export const startChangePatient = async (machineId: string):Promise<string>=> {
    const response= await api.post(`/machines/change-patient/${machineId}`)
    return response.data;
}
export const changePatient = async (machineId: string, patientId:string,lockId:string) => {
    const response = await api.put(`/machines/change-patient/${machineId}`, {patient: patientId, lockId: lockId})
    return response.data;
}

export const updateMachine=async (machineId:string, name?:string,location?:string)=>{
    const response=await api.put(`/machines/${machineId}`,{name:name,location:location})
    return response.data
}

export const exitChangePatient=async(machineId:string,lockId:string)=>{
    const response = await api.put(`/machines/change-patient/exit/${machineId}`, {lockId: lockId})
    return response.data;
}