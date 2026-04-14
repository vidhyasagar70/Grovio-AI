"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin }));
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        data: { status: "ok" },
    });
});
// Public auth routes (no authorization required)
app.use("/auth", authRoutes_1.default);
// Protected note routes (authorization required)
app.use("/notes", authMiddleware_1.authMiddleware, noteRoutes_1.default);
app.use(notFound_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
