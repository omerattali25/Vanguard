import { useQuery } from "@tanstack/react-query";
import { getMachinesAnalytics } from "./machines-analytics.api";

export function useMachinesAnalytics() {
    const { data, isPending, error } = useQuery({
        queryKey: ['machines-analytics' ],
        queryFn: () => getMachinesAnalytics(),
    }) 
    return { data, isPending, error };
}