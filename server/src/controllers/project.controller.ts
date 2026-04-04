import { Request, Response } from "express";
import { projectEditSchema, projectSchema } from "../schemas/project.schema";
import { prisma } from "../lib/prisma";
import { CustomRequest } from "../types/customRequest";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import { format } from "node:path";
import { CustomTypesConfig } from "pg";
import { text } from "node:stream/consumers";

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
