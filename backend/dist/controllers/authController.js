"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const zod_1 = require("zod");
const authService_1 = require("../services/authService");
const appError_1 = require("../utils/appError");
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.authController = {
    signup: async (req, res) => {
        try {
            const parsed = signupSchema.parse(req.body);
            const result = await authService_1.authService.signup({
                email: parsed.email,
                password: parsed.password,
            });
            res.status(201).json({
                success: true,
                data: result,
                message: "Account created successfully",
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: error.issues[0]?.message ?? "Validation error",
                });
            }
            else if (error instanceof appError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: "Failed to create account",
                });
            }
        }
    },
    login: async (req, res) => {
        try {
            const parsed = loginSchema.parse(req.body);
            const result = await authService_1.authService.login({
                email: parsed.email,
                password: parsed.password,
            });
            res.status(200).json({
                success: true,
                data: result,
                message: "Login successful",
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: error.issues[0]?.message ?? "Validation error",
                });
            }
            else if (error instanceof appError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: "Login failed",
                });
            }
        }
    },
};
