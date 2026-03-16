import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "./recommendations.api";

export const useRecommendations = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
  });

  return { data, isPending, error };
};
