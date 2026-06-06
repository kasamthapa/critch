import type { Request, Response } from "express";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { userSignupSchema, userSignInSchema } from "../schemas/auth.schema";

import { JWT_SECRET } from "../config/env.js";
import { ApiError } from "../utils/ApiError";

import { ApiResponse } from "../utils/ApiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenGen";
import { JwtPayload } from "../types/jwtPayload";
import { CustomRequest } from "../types/customRequest";
import { uploadOnCloudinary } from "../utils/cloudinary";
import strict from "node:assert/strict";

export const userSignupController = async (req: Request, res: Response) => {
  const { username, email, password } = userSignupSchema.parse(req.body);
  const salt = await genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      bio: "",
      avatarURL: "",
      reputationScore: 0,
    },
  });
  res.status(200).json(new ApiResponse(200, "user signed up successfully", {}));
};

export const userSignInController = async (req: Request, res: Response) => {
  const { email, password } = userSignInSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accesstoken = generateAccessToken(user.id.toString());
  const refreshToken = generateRefreshToken(user.id.toString());
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.$transaction(async (t) => {
    await t.refreshToken.deleteMany({
      where: {
        user_id: user.id,
      },
    });
    await t.refreshToken.create({
      data: {
        user_id: user.id,
        token: hashedRefreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  });

  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarURL,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  });

  res.status(200).json(
    new ApiResponse(
      200,
      "User signed in successfully",
      { user: userResponse, accesstoken }, // Wraping both in the 'data' object
    ),
  );
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const RefreshToken = req.cookies.refreshToken;

  if (!RefreshToken) {
    throw new ApiError(404, "Refresh token not found");
  }
  const decoded = jwt.verify(RefreshToken, JWT_SECRET) as JwtPayload;

  const isPresentInDB = await prisma.refreshToken.findFirst({
    where: {
      user_id: Number(decoded.userId),
    },
    select: {
      token: true,
    },
  });
  if (!isPresentInDB) {
    console.log("not found in db");
    throw new ApiError(401, "Invalid Token");
  }
  const isValid = await bcrypt.compare(RefreshToken, isPresentInDB.token);

  if (!isValid) {
    console.log("not valid with db one");
    throw new ApiError(401, "Invalid Token");
  }
  const newAccessToken = generateAccessToken(decoded.userId);

  res.json(
    new ApiResponse(200, "new access token generated", { newAccessToken }),
  );
};

export const logoutController = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.userId;
  if (userId) {
    await prisma.refreshToken.deleteMany({
      where: {
        user_id: Number(userId),
      },
    });
  }

  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    })
    .json({ message: "User Logged out Successfully" });
};

export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const userId = user?.userId;
  const userData = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      reputationScore: true,
      reviewCount: true,
      avatarURL: true,
    },
  });

  res.json(new ApiResponse(200, "User fetched", { userData }));
};

export const getUserProfile = async (req: Request, res: Response) => {
  const username = req.params.username;
  if (Array.isArray(username))
    throw new ApiError(400, "Invalid username format");
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      projects: {
        select: {
          id: true,
          title: true,
          avgRating: true,
        },
      },
    },
  });
  const reviewGivenCount = await prisma.review.count({
    where: { userId: user?.id },
  });
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(
    new ApiResponse(200, "User profile fetched successfully", {
      ...user,
      reviewGivenCount,
    }),
  );
};

export const avatarUploadController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userId = Number(req.user?.userId);
  if (!req.file)
    throw new ApiError(
      400,
      "No file uploaded. Please select a file to continue.",
    );
  const localFilePath = req.file.path;
  const avatar = await uploadOnCloudinary(localFilePath);
  if (!avatar)
    throw new ApiError(
      500,
      "Failed to upload image to storage. Please try again later.",
    );
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarURL: avatar.url,
    },
  });
  res.status(200).json(
    new ApiResponse(200, "avatar uploaded  successfully", {
      avatarUrl: avatar.url,
    }),
  );
};

export const bioUpdateController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userId = Number(req.user?.userId);
  const { bio } = req.body;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      bio,
    },
  });
  res.status(200).json(new ApiResponse(200, "bio added  successfully", {}));
};
