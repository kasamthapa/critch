import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/customRequest";
import { ApiError } from "../utils/ApiError";
import { JWT_SECRET } from "../config/env";
import { JwtPayload } from "../types/jwtPayload";

import { asyncHandler } from "../utils/asyncHandler";

export const authMiddleware = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, "Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  },
);
