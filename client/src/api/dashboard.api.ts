import type { getDashboardDataResponse } from "../types/dashboard.types";
import { api } from "./axiosInstance";

export const getDashboardData = async (): Promise<getDashboardDataResponse> => {
  const response = await api.get("/dashboard");
  return response.data;
};
