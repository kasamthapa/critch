import * as z from "zod";
import type { Request, Response } from "express";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { userSignupSchema, userSignInSchema } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { JWT_SECRET } from "../config/env.js";
import { ApiError } from "../utils/ApiError";
import app from "../app";
import { ApiResponse } from "../utils/ApiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenGen";
import { JwtPayload } from "../types/jwtPayload";
import { CustomRequest } from "../types/customRequest";
import { primitiveTypes } from "zod/v4/core/util.cjs";

export const userSignupController = async (req: Request, res: Response) => {
  const { username, email, password } = userSignupSchema.parse(req.body);
  const salt = await genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      bio: "",
      avatarURL: "",
      reputationScore: 0,
    },
    select: {
      id: true,
      username: true,
      email: true,
      reputationScore: true,
      created_at: true,
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, "user signed up successfully", { user }));
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

  await prisma.refreshToken.create({
    data: {
      user_id: user.id,
      token: hashedRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60),
    },
  });

  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    avatar: user.avatarURL,
    reputationScore: user.reputationScore,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
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
  const hashedRefreshToken = await bcrypt.hash(RefreshToken, 10);
  const isPresentInDB = await prisma.refreshToken.findFirst({
    where: {
      user_id: Number(decoded.userId),
    },
    select: {
      token: true,
    },
  });
  if (!isPresentInDB) {
    throw new ApiError(401, "Invalid Token");
  }

  const newAccessToken = generateAccessToken(decoded.userId);

  res.json(
    new ApiResponse(200, "new access token generated", { newAccessToken }),
  );
};

export const logoutController = async (req: Request, res: Response) => {};

export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const userId = user?.userId;
  const userData = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      username: true,
      email: true,
      reputationScore: true,
    },
  });

  res.json(new ApiResponse(200, "User authorized", { userData }));
};
