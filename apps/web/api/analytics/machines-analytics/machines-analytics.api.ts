import { api } from "api/axios/axios";
import { MachineAction } from "types/machine-action";

export async function getMachinesAnalytics(): Promise<MachineAction[]> {
    const response = await api.get(`/analitycs/machines`);
    return response.data;
}
