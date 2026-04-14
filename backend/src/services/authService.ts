import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "../repositories/authRepository";
import { AppError } from "../utils/appError";
import { env } from "../config/env";
import type { User, SignupInput, LoginInput, AuthResponse, JwtPayload } from "../types/auth";

const SALT_ROUNDS = 10;

export const authService = {
  signup: async (input: SignupInput): Promise<AuthResponse> => {
    const { email, password } = input;

    // Check if email already exists
    const existingUser = authRepository.getUserByEmail(email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = authRepository.createUser(email, passwordHash);

    // Generate token
    const token = authService.generateToken(user);

    return { user, token };
  },

  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { email, password } = input;

    // Check if user exists
    const user = authRepository.getUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Get password hash
    const passwordHash = authRepository.getPasswordHash(email);
    if (!passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate token
    const token = authService.generateToken(user);

    return { user, token };
  },

  generateToken: (user: User): string => {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: "7d",
    });
  },

  verifyToken: (token: string): JwtPayload => {
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      return decoded as JwtPayload;
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  },
};
