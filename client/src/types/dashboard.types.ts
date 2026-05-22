import type { ApiResponse } from "./apiResponse.types";
import type { ProjectSummary } from "./project.types";
import type { SimpleReview } from "./review.types";

export interface dashboardPage {
  projects: ProjectSummary[];
  reviewsGiven: SimpleReview[];
}
export const DashboardContent = {
  MY_PROJECT: "myProjects",
  REVIEWS_RECEIVED: "reviewsReceived",
  REVIEWS_GIVEN: "reviewsGiven",
} as const;
export type DashBoardContent =
  (typeof DashboardContent)[keyof typeof DashboardContent];
export type getDashboardDataResponse = ApiResponse<dashboardPage>;
