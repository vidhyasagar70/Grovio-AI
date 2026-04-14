"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT ?? 4000),
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    dbPath: process.env.DB_PATH ?? "./data/notes.db",
    jwtSecret: process.env.JWT_SECRET ?? "your-secret-key-change-in-production",
};
