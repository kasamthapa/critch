import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ZodError } from "zod";
import { ApiResponse } from "../utils/ApiResponse";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation failed", { errors: err.issues }));
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json(new ApiResponse(401, "Token expired", null));
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(new ApiResponse(401, "Invalid Token", null));
  }
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.message, null));
  }

  return res
    .status(500)
    .json(new ApiResponse(500, "Internal server error", null));
};
