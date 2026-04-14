"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authService_1 = require("../services/authService");
const appError_1 = require("../utils/appError");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new appError_1.AppError("Missing or invalid authorization header", 401);
        }
        const token = authHeader.substring(7);
        const decoded = authService_1.authService.verifyToken(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
};
exports.authMiddleware = authMiddleware;
