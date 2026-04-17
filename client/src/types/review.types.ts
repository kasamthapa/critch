export interface CreateReviewRequest {
  codeQuality: number;
  uiDesign: number;
  ideaScore: number;
  documentation: number;
  comment: string;
}
export interface ReviewAuthor {
  username: string;
  avatarURL: string;
}
export interface Review {
  id: number;
  codeQuality: string;
  uiDesign: string;
  ideaScore: string;
  documentation: string;
  comment: string;
  avgReview: string;
  created_at: string;
  userId: number;
  projectId: number;
  user: ReviewAuthor;
}
