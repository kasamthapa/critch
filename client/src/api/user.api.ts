import type {
  avatarUploadResponse,
  getUserProfileResponse,
} from "../types/user.types";
import { api } from "./axiosInstance";
export const getUserProfile = async (
  name: string,
): Promise<getUserProfileResponse> => {
  const response = await api.get(`/users/${name}`);
  return response.data;
};
export const avatarUpload = async (
  data: FormData,
): Promise<avatarUploadResponse> => {
  const response = await api.post("/users/avatarUpload", data);
  return response.data;
};
