import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return function (req, res, next) {
    const result = fn(req, res, next);
    Promise.resolve(result).catch(next);
  };
};
