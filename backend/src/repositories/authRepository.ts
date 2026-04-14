import db from "../db/sqlite";
import type { User } from "../types/auth";

export const authRepository = {
  getUserByEmail: (email: string): User | null => {
    const row = db
      .prepare("SELECT id, email, created_at, updated_at FROM users WHERE email = ?")
      .get(email) as any;
    return row || null;
  },

  getUserById: (id: number): User | null => {
    const row = db
      .prepare("SELECT id, email, created_at, updated_at FROM users WHERE id = ?")
      .get(id) as any;
    return row || null;
  },

  createUser: (email: string, passwordHash: string): User => {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      "INSERT INTO users (email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(email, passwordHash, now, now);

    return {
      id: result.lastInsertRowid as number,
      email,
      created_at: now,
      updated_at: now,
    };
  },

  getPasswordHash: (email: string): string | null => {
    const row = db
      .prepare("SELECT password_hash FROM users WHERE email = ?")
      .get(email) as any;
    return row?.password_hash || null;
  },
};
