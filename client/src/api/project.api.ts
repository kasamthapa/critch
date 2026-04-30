import type {
  GetAllProjectResponse,
  GetOneProjectResponse,
} from "../types/project.types";
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
