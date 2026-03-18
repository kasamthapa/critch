import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
