import type { User } from "../types/auth";
import { pool } from "../db/postgres";

type UserRow = {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
};

type PasswordRow = {
  password_hash: string;
};

export const authRepository = {
  getUserByEmail: async (email: string): Promise<User | null> => {
    const result = await pool.query<UserRow>(
      `
        SELECT
          id,
          email,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM users
        WHERE email = $1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  },

  getUserById: async (id: number): Promise<User | null> => {
    const result = await pool.query<UserRow>(
      `
        SELECT
          id,
          email,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  },

  createUser: async (email: string, passwordHash: string): Promise<User> => {
    const result = await pool.query<UserRow>(
      `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING
          id,
          email,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `,
      [email, passwordHash],
    );

    return result.rows[0];
  },

  getPasswordHash: async (email: string): Promise<string | null> => {
    const result = await pool.query<PasswordRow>(
      "SELECT password_hash FROM users WHERE email = $1",
      [email],
    );

    return result.rows[0]?.password_hash ?? null;
  },
};
