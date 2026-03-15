import { useQuery } from "@tanstack/react-query";
import { getPatientById, getPatients } from "./patient.api";

export const usePatients = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ['patients'],
        queryFn: getPatients,
    });

    return { data, isPending, error };
}

export const usePatient = (id : string) => {
    const { data, isPending, error } = useQuery({
        queryKey: ['patients', id],
        queryFn: () => getPatientById(id),
    });
    return { data, isPending, error };
}