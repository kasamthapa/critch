import { Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";

export const dashboardPageController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userId = Number(req.user?.userId);
  const projectData = await prisma.project.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      reviews: true,
    },
  });
  const reviewsGiven = await prisma.review.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          title: true,
        },
      },
    },
  });
  const responseBody = {
    projects: projectData,
    reviewsGiven,
  };
  res.status(200).json(new ApiResponse(200, "", responseBody));
};
