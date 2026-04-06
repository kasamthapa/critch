import { Request, Response } from "express";
import {
  projectEditSchema,
  projectSchema,
  reviewSchema,
} from "../schemas/project.schema";
import { prisma } from "../lib/prisma";
import { CustomRequest } from "../types/customRequest";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

export const createProjectController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userId = req.user?.userId;
  const { title, description, liveURL, githubURL, tags } = projectSchema.parse(
    req.body,
  );
  if (!req.file)
    throw new ApiError(
      400,
      "No file uploaded. Please select a file to continue.",
    );
  const localFilePath = req.file.path;
  const screenshotData = await uploadOnCloudinary(localFilePath);
  if (!screenshotData)
    throw new ApiError(
      500,
      "Failed to upload image to storage. Please try again later.",
    );

  const TagIds: Array<number> = [];

  const newProject = await prisma.$transaction(async (tx) => {
    for (const tag of tags) {
      const upsertedTags = await tx.tag.upsert({
        where: {
          name: tag,
        },
        create: { name: tag },
        update: {},
      });
      console.log(upsertedTags);
      TagIds.push(upsertedTags.id);
    }

    return await tx.project.create({
      data: {
        title: title,
        description: description,
        liveURL: liveURL,
        githubURL: githubURL,
        screenshotURL: screenshotData.url,
        screenshotPublicId: screenshotData.public_id,
        userId: Number(userId),
        tags: {
          create: TagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  });
  const formatedTags = newProject.tags.map((t) => t.tag.name);
  res.status(201).json(
    new ApiResponse(201, "project created successfully", {
      ...newProject,
      tags: formatedTags,
    }),
  );
};

export const getProjectController = async (req: Request, res: Response) => {
  let whereClause = {};
  if (req.query.tag) {
    whereClause = {
      tags: {
        some: {
          tag: {
            name: req.query.tag,
          },
        },
      },
    };
  }
  const projects = await prisma.project.findMany({
    where: whereClause,
    orderBy: {
      avgRating: "desc",
    },
    include: {
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  const formatedProjects = projects.map((project) => {
    const formatedTags = project.tags.map((t) => t.tag.name);
    return { ...project, tags: formatedTags };
  });

  res.status(200).json(
    new ApiResponse(200, "Projects retreived successsfully", {
      formatedProjects,
    }),
  );
};
export const getOneProjecttController = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, "Project fetched successfully", project));
};
export const editProjectController = async (
  req: CustomRequest,
  res: Response,
) => {
  const projectId = Number(req.params.projectId);
  const userId = Number(req.user?.userId);
  const { title, description, liveURL, githubURL, tags } =
    projectEditSchema.parse(req.body);

  const updatedProject = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project || project.userId !== userId)
      throw new ApiError(403, "Unauthorized");

    return tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        title: title,
        description: description,
        liveURL: liveURL,
        githubURL: githubURL,
        tags: {
          deleteMany: {},
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tagName,
                },
                create: {
                  name: tagName,
                },
              },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  });

  const formatedTags = updatedProject.tags.map((t) => t.tag.name);

  res.status(200).json(
    new ApiResponse(200, "Project updated successfully", {
      ...updatedProject,
      formatedTags,
    }),
  );
};

export const deleteProjectController = async (
  req: CustomRequest,
  res: Response,
) => {
  const projectId = Number(req.params.id);
  const userId = Number(req.user?.userId);
  await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project || project.userId !== userId)
      throw new ApiError(403, "Unauthorized");
    await tx.project.delete({
      where: {
        id: projectId,
      },
    });
  });
  res
    .status(200)
    .json(new ApiResponse(200, "Project deleted successfully", {}));
};

//Reviews APIs

export const createReviewController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userID = Number(req.user?.userId);
  const projectId = Number(req.params.projectId);
  const { codeQuality, uiDesign, ideaScore, documentation, comment } =
    reviewSchema.parse(req.body);

  // Wrap operations in a Transaction to ensure Data Integrity
  const newReview = await prisma.$transaction(async (tx) => {
    // 1. Validation: Ensure project exists and fetch existing reviewers
    const project = await tx.project.findUnique({
      where: { id: projectId },
      include: { reviews: { select: { userId: true } } },
    });

    if (!project) throw new ApiError(404, "Project not found");

    // Authorization: Prevent users from boosting their own project scores
    if (project.userId === userID) {
      throw new ApiError(403, "Reviewing your own project is not allowed");
    }

    // Guard Clause: Enforce a "One Review Per Project" policy
    const alreadyReviewed = project.reviews.some((r) => r.userId === userID);
    if (alreadyReviewed) {
      throw new ApiError(409, "You have already reviewed this project!");
    }

    // 2. Business Logic: Calculate granular average for the new review
    const avgRating = (codeQuality + uiDesign + ideaScore + documentation) / 4;

    const createdReview = await tx.review.create({
      data: {
        codeQuality,
        uiDesign,
        ideaScore,
        documentation,
        avgReview: avgRating,
        userId: userID,
        projectId,
        comment,
      },
    });

    // 3. Dynamic Aggregation: Recalculate Project's overall rating
    const projectStats = await tx.review.aggregate({
      where: { projectId: projectId },
      _avg: { avgReview: true },
    });

    await tx.project.update({
      where: { id: projectId },
      data: { avgRating: projectStats._avg.avgReview ?? 0 },
    });

    // 4. Reputation System: Solve the "Average of Averages" problem
    // We aggregate every individual review across ALL of the owner's projects
    // This gives every human vote equal weight for the User's Reputation Score
    const ownerStats = await tx.review.aggregate({
      where: {
        project: { userId: project.userId },
      },
      _avg: { avgReview: true },
      _count: { _all: true },
    });

    // Sync User Reputation and Review Count in a single update
    await tx.user.update({
      where: { id: project.userId },
      data: {
        reputationScore: ownerStats._avg.avgReview ?? 0,
        reviewCount: ownerStats._count._all,
      },
    });

    return createdReview;
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Project review submitted successfully", newReview),
    );
};
