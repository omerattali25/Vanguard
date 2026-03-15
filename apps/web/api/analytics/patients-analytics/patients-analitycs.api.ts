import { api } from "api/axios/axios";
import { MachineAction } from "types/machine-action";

export async function getPatientAnalytics(patientId: string): Promise<MachineAction[]> {
    const response = await api.get(`/analitycs/patients/${patientId}`)
    return response.data;
}
