import type {
  SignupRequest,
  SignInRequest,
  AuthResponse,
} from "../types/auth.types";

import { api } from "./axiosInstance";

export const singUp = async (data: SignupRequest) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
  const response = await api.post("/auth/signin", data);
  return response.data;
};
