"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const sqlite_1 = __importDefault(require("../db/sqlite"));
exports.authRepository = {
    getUserByEmail: (email) => {
        const row = sqlite_1.default
            .prepare("SELECT id, email, created_at, updated_at FROM users WHERE email = ?")
            .get(email);
        return row || null;
    },
    getUserById: (id) => {
        const row = sqlite_1.default
            .prepare("SELECT id, email, created_at, updated_at FROM users WHERE id = ?")
            .get(id);
        return row || null;
    },
    createUser: (email, passwordHash) => {
        const now = new Date().toISOString();
        const stmt = sqlite_1.default.prepare("INSERT INTO users (email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)");
        const result = stmt.run(email, passwordHash, now, now);
        return {
            id: result.lastInsertRowid,
            email,
            created_at: now,
            updated_at: now,
        };
    },
    getPasswordHash: (email) => {
        const row = sqlite_1.default
            .prepare("SELECT password_hash FROM users WHERE email = ?")
            .get(email);
        return row?.password_hash || null;
    },
};
