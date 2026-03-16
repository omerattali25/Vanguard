import { useMutation, useQuery } from "@tanstack/react-query";
import { exitPatientVitals, getPatientVitals, getVitals } from "./vitals.api";

export function useVitals() {
    const { data, isPending, error } = useQuery({
        queryKey: ['vitals'],
        queryFn: getVitals,
    });

    return { data, isPending, error };
}

export function usePatientVitals(id : string) {
    const { data, isPending, error } = useQuery({
        queryKey: ['vitals', id],
        queryFn: () => getPatientVitals(id),
    });
    return { data, isPending, error };
}

export function useExitPatientVitals(id : string) {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['vitals', id, 'exit'],
        mutationFn: () => exitPatientVitals(id),
    });
    return { mutate, isPending, error };
}