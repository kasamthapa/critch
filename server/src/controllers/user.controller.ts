import * as z from "zod";
import type { Request, Response } from "express";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { userSignupSchema, userSignInSchema } from "../schemas/auth.schema";

import { JWT_SECRET } from "../config/env.js";

export const userSignupController = async (req: Request, res: Response) => {
  try {
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
    res.status(200).json({
      message: "user signed up successfully",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

export const userSignInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = userSignInSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      //   select: {
      //     id: true,
      //     username: true,
      //     email: true,
      //     reputationScore: true,
      //   },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      message: "User signed in successfully",
      token,
      User: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatarURL,
        reputationScore: user.reputationScore,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};
