import * as z from "zod";
import bcrypt, { genSalt } from "bcryptjs";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { userSignupSchema } from "../schemas/user.schema.js";
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
      message: "user created successfully",
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
