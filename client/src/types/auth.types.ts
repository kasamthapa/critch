import type { UserSummary } from "./user.types";
import type { ApiResponse } from "./apiResponse.types";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthData {
  user: UserSummary;
  accesstoken: string;
}
export interface AuthContextType {
  user: UserSummary | null;
  accesstoken: string | null;

  login: (data: AuthData) => void;
  logout: () => void;
}
export type SignInResponse = ApiResponse<AuthData>;
export type SignUpResponse = ApiResponse<null>;
