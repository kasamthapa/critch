import type { ApiResponse } from "./apiResponse.types";
import type { ProjectSummary } from "./project.types";
import type { Review } from "./review.types";

export interface ReviewDetails extends Review {
  project: { title: string };
}
export interface ProjectWithReviews extends ProjectSummary {
  reviews: ReviewDetails[];
}
export interface dashboardPage {
  projects: ProjectWithReviews[];
  reviewsGiven: ReviewDetails[];
}
export const DashboardContent = {
  MY_PROJECT: "myProjects",
  REVIEWS_RECEIVED: "reviewsReceived",
  REVIEWS_GIVEN: "reviewsGiven",
} as const;
export type DashBoardContent =
  (typeof DashboardContent)[keyof typeof DashboardContent];
export type getDashboardDataResponse = ApiResponse<dashboardPage>;
