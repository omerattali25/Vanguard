import { api } from "api/axios/axios";
import { Recommendation } from "types/recommendation";

export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await api.get("/recommendations");
  return response.data;
}
