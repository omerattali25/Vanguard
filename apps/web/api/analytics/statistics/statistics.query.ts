import { useQuery } from "@tanstack/react-query";
import { getLeastConnectedPatient, getMostConnectedPatient } from "./statistics.api";



export function usePatientAnalytics() {
    const { data, isPending, error } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => getMostConnectedPatient(),
    });
    return { data, isPending, error };
}

export function useLeastConnectedPatient() {
    const { data, isPending, error } = useQuery({
        queryKey: ['least-connected-patient'],
        queryFn: () => getLeastConnectedPatient(),
    });
    return { data, isPending, error };
}