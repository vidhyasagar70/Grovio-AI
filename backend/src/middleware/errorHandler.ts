import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      data: null,
      message: error.issues[0]?.message ?? "Validation error.",
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      data: null,
      message: error.message,
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Unexpected server error.";

  res.status(500).json({
    success: false,
    data: null,
    message,
  });
};
