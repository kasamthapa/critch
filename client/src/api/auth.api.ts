import type {
  SignUpRequest,
  SignInRequest,
  SignInResponse,
  SignUpResponse,
} from "../types/auth.types";

import { api } from "./axiosInstance";

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await api.post("/auth/signin", data);
  return response.data;
};
