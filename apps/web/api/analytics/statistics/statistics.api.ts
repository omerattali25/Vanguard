import { Machine } from "@/types/machine";
import { api } from "api/axios/axios";
import { Patient } from "types/patient";

export async function getMostConnectedPatient(): Promise<Patient> {
    const response = await api.get(`/analitycs/all-stats/most-connected-patient`);
    return response.data;
}

export async function getLeastConnectedPatient(): Promise<Patient> {
    const response = await api.get(`/analitycs/all-stats/least-connected-patient`);
    return response.data;
}

export async function getMostUsedMachine() : Promise<Machine> {
    const response = await api.get(`/analitycs/all-stats/most-used-machine`);
    return response.data;
}

export async function getPatientsPerDay() : Promise<Map<number, number>> {
    const response = await api.get(`/analitycs/all-stats/patients-per-day`);
    return response.data;
}