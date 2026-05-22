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
    include: {
      reviews: {
        include: {
          user: {
            select: {
              username: true,
              avatarURL: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          username: true,
          avatarURL: true,
          reputationScore: true,
        },
      },
      _count: {
        select: { reviews: true },
      },
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
  const formattedProjects = projectData.map((p) => ({
    ...p,
    tags: p.tags.map((t) => t.tag.name),
  }));
  const responseBody = {
    projects: formattedProjects,
    reviewsGiven,
  };
  res.status(200).json(new ApiResponse(200, "", responseBody));
};
