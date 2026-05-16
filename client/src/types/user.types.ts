import type { ApiResponse } from "./apiResponse.types";

export interface UserSummary {
  id: number;
  username: string;
  email: string;
}
export interface User extends UserSummary {
  avatarUrl: string;
  bio: string;
  reputationScore: string;
  reviewCount: number;
  reviewGivenCount: number;
}

export type getUserProfileResponse = ApiResponse<User>;
