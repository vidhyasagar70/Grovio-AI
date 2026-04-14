"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const appError_1 = require("../utils/appError");
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            data: null,
            message: error.issues[0]?.message ?? "Validation error.",
        });
        return;
    }
    if (error instanceof appError_1.AppError) {
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
exports.errorHandler = errorHandler;
