import { useQuery } from "@tanstack/react-query";
import { getMachines } from "./machines.api";

export function useMachines() {
    const { data, isPending, error } = useQuery({
        queryKey: ['machines'],
        queryFn: getMachines,
    });

    return { data, isPending, error };
}