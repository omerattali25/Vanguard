import { useQuery } from "@tanstack/react-query";
import { getPatients } from "./patient.api";

export function usePatients() {
    const { data, isPending, error } = useQuery({
        queryKey: ['patients'],
        queryFn: getPatients,
    });

    return { data, isPending, error };
}