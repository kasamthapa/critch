import type { UserSummary } from "./user.types";
import type { ApiResponse } from "./apiResponse.types";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  user: UserSummary;
  accesstoken: string;
}
export type AuthResponse = ApiResponse<AuthData>;
