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

  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    avatar: user.avatarURL,
    reputationScore: user.reputationScore,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      "User signed in successfully",
      { user: userResponse, token }, // Wraping both in the 'data' object
    ),
  );
};
