"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRepository_1 = require("../repositories/authRepository");
const appError_1 = require("../utils/appError");
const env_1 = require("../config/env");
const SALT_ROUNDS = 10;
exports.authService = {
    signup: async (input) => {
        const { email, password } = input;
        // Check if email already exists
        const existingUser = await authRepository_1.authRepository.getUserByEmail(email);
        if (existingUser) {
            throw new appError_1.AppError("Email already registered", 400);
        }
        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            throw new appError_1.AppError("Password must be at least 6 characters", 400);
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        // Create user
        const user = await authRepository_1.authRepository.createUser(email, passwordHash);
        // Generate token
        const token = exports.authService.generateToken(user);
        return { user, token };
    },
    login: async (input) => {
        const { email, password } = input;
        // Check if user exists
        const user = await authRepository_1.authRepository.getUserByEmail(email);
        if (!user) {
            throw new appError_1.AppError("Invalid email or password", 401);
        }
        // Get password hash
        const passwordHash = await authRepository_1.authRepository.getPasswordHash(email);
        if (!passwordHash) {
            throw new appError_1.AppError("Invalid email or password", 401);
        }
        // Verify password
        const isPasswordValid = await bcrypt_1.default.compare(password, passwordHash);
        if (!isPasswordValid) {
            throw new appError_1.AppError("Invalid email or password", 401);
        }
        // Generate token
        const token = exports.authService.generateToken(user);
        return { user, token };
    },
    generateToken: (user) => {
        const payload = {
            userId: user.id,
            email: user.email,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, {
            expiresIn: "7d",
        });
    },
    verifyToken: (token) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
            return decoded;
        }
        catch (error) {
            throw new appError_1.AppError("Invalid or expired token", 401);
        }
    },
};
