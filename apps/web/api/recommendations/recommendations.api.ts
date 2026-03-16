import { api } from "api/axios/axios";

export async function getRecommendations(): Promise<Record<string, number>> {
  const response = await api.get("/recommendations");
  return response.data;
}
