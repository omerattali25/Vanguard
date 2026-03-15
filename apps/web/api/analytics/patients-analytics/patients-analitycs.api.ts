import { api } from "api/axios/axios";
import { MachineAction } from "types/machine-action";
import { Vital } from "types/vitals";

export async function getPatientAnalytics(patientId: string): Promise<MachineAction[]> {
    const response = await api.get(`/analitycs/patients/${patientId}`)
    return response.data;
}
