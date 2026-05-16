import type { getUserProfileResponse } from "../types/user.types";
import { api } from "./axiosInstance";
export const getUserProfile = async (
  name: string,
): Promise<getUserProfileResponse> => {
  const response = await api.get(`/users/${name}`);
  return response.data;
};
