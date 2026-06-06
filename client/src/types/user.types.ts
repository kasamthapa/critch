import type { ApiResponse } from "./apiResponse.types";

export interface UserSummary {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
}
interface userProject {
  id: number;
  title: string;
  avgRating: string;
}
export interface User extends UserSummary {
  avatarURL: string;
  bio: string;
  reputationScore: string;
  reviewCount: number;
  reviewGivenCount: number;
  projects: userProject[];
}

export type getUserProfileResponse = ApiResponse<User>;
export type avatarUploadResponse = ApiResponse<{ avatarUrl: string }>;
