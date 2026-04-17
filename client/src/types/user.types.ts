export interface Signuprequest {
  username: string;
  email: string;
  password: string;
}
export interface LoginRequest {
  email: string;
  passwrod: string;
}
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
}
