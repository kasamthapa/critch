import type { ApiResponse } from "./apiResponse.types";

export interface UserSummary {
  id: number;
  username: string;
  email: string;
}
interface userProject {
  id: number;
  title: string;
  avgRating: string;
}
export interface User extends UserSummary {
  avatarUrl: string;
  bio: string;
  reputationScore: string;
  reviewCount: number;
  reviewGivenCount: number;
  projects: userProject[];
}

export type getUserProfileResponse = ApiResponse<User>;
