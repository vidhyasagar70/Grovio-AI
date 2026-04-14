"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const postgres_1 = require("../db/postgres");
exports.authRepository = {
    getUserByEmail: async (email) => {
        const result = await postgres_1.pool.query(`
        SELECT
          id,
          email,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM users
        WHERE email = $1
      `, [email]);
        return result.rows[0] ?? null;
    },
    getUserById: async (id) => {
        const result = await postgres_1.pool.query(`
        SELECT
          id,
          email,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM users
        WHERE id = $1
      `, [id]);
        return result.rows[0] ?? null;
    },
    createUser: async (email, passwordHash) => {
        const result = await postgres_1.pool.query(`
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING
          id,
          email,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `, [email, passwordHash]);
        return result.rows[0];
    },
    getPasswordHash: async (email) => {
        const result = await postgres_1.pool.query("SELECT password_hash FROM users WHERE email = $1", [email]);
        return result.rows[0]?.password_hash ?? null;
    },
};
