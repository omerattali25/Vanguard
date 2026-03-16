import { api } from "api/axios/axios";
import { MachineAction } from "types/machine-action";
import { Patient } from "types/patient";

export async function getMostConnectedPatient(): Promise<Patient> {
    const response = await api.get(`/analitycs/all-stats/most-connected-patient`);
    return response.data;
}

export async function getLeastConnectedPatient(): Promise<Patient> {
    const response = await api.get(`/analitycs/all-stats/least-connected-patient`);
    return response.data;
}
