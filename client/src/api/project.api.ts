import type { GetAllProjectResponse } from "../types/project.types";
import { api } from "./axiosInstance";

export const getProjects = async (): Promise<GetAllProjectResponse> => {
  const response = await api.get("/projects");
  return response.data;
};
