import type {
  GetAllProjectResponse,
  GetOneProjectResponse,
} from "../types/project.types";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
} from "../types/review.types";
import { api } from "./axiosInstance";

export const getProjects = async (
  tag?: string,
): Promise<GetAllProjectResponse> => {
  const response = await api.get("/projects", { params: tag ? { tag } : {} });
  return response.data;
};
export const getOneProject = async (
  id: string,
): Promise<GetOneProjectResponse> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};
export const createReview = async ({
  projectId,
  codeQuality,
  uiDesign,
  ideaScore,
  documentation,
  comment,
}: CreateReviewRequest): Promise<CreateReviewResponse> => {
  const response = await api.post(`/projects/${projectId}/reviews`, {
    codeQuality,
    uiDesign,
    ideaScore,
    documentation,
    comment,
  });
  return response.data;
};
