import { Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/authService";
import { AppError } from "../utils/appError";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const authController = {
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = signupSchema.parse(req.body);

      const result = await authService.signup({
        email: parsed.email,
        password: parsed.password,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: "Account created successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: error.issues[0]?.message ?? "Validation error",
        });
      } else if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to create account",
        });
      }
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = loginSchema.parse(req.body);

      const result = await authService.login({
        email: parsed.email,
        password: parsed.password,
      });

      res.status(200).json({
        success: true,
        data: result,
        message: "Login successful",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: error.issues[0]?.message ?? "Validation error",
        });
      } else if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Login failed",
        });
      }
    }
  },
};
