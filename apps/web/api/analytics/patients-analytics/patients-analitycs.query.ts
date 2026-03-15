import { useQuery } from "@tanstack/react-query";
import { getPatientAnalytics } from "./patients-analitycs.api";



export function usePatientAnalytics(id : string) {
    const { data, isPending, error } = useQuery({
        queryKey: ['analytics', id],
        queryFn: () => getPatientAnalytics(id),
    });
    return { data, isPending, error };
}