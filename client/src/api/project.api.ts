import type { GetAllProjectResponse } from "../types/project.types";
import { api } from "./axiosInstance";

export const getProjects = async (
  tag?: string,
): Promise<GetAllProjectResponse> => {
  const response = await api.get("/projects", { params: tag ? { tag } : {} });
  return response.data;
};
