import { Request } from "express";
import { JwtPayload } from "./jwtPayload";
export interface CustomRequest extends Request {
  user?: JwtPayload;
}
