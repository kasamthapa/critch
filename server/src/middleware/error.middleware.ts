import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: err.issues });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({
    message: "Internal server error",
  });
};
