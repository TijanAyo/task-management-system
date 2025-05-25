import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message;
  const statusCode = err.statusCode;

  res.status(statusCode).json({
    error: err.name,
    message: message || "An unexpected error occurred",
    success: false,
  });
};
