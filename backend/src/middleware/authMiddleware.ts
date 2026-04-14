import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { AppError } from "../utils/appError";

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid authorization header", 401);
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  }
};
