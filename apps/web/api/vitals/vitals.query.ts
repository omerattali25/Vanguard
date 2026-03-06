import { useQuery } from "@tanstack/react-query";
import { getVitals } from "./vitals.api";

export function useVitals() {
    const { data, isPending, error } = useQuery({
        queryKey: ['vitals'],
        queryFn: getVitals,
    });

    return { data, isPending, error };
}