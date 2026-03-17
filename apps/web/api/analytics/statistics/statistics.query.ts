import { useQuery } from "@tanstack/react-query";
import { getLeastConnectedPatient, getMostConnectedPatient, getMostUsedMachine, getPatientsPerDay } from "./statistics.api";



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

export function useMostUsedMachine() {
    const { data, isPending, error } = useQuery({
        queryKey: ['most-used-machine'],
        queryFn: () => getMostUsedMachine(),
    });
    return { data, isPending, error };
}

export function usePatientsPerDay() {
    const { data, isPending, error } = useQuery({
        queryKey: ['patients-per-day'],
        queryFn: () => getPatientsPerDay(),
    });
    return { data, isPending, error };
}