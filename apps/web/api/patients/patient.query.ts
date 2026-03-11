import { useQuery } from "@tanstack/react-query";
import { getPatientById, getPatients } from "./patient.api";

export function usePatients() {
    const { data, isPending, error } = useQuery({
        queryKey: ['patients'],
        queryFn: getPatients,
    });

    return { data, isPending, error };
}

export function usePatient(id : string) {
    const { data, isPending, error } = useQuery({
        queryKey: ['patient', id],
        queryFn: () => getPatientById(id),
    });
    return { data, isPending, error };
}