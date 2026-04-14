"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const getPoolConfig = () => {
    if (!env_1.env.databaseUrl) {
        throw new Error("DATABASE_URL is required for Postgres.");
    }
    return {
        connectionString: env_1.env.databaseUrl,
        ssl: env_1.env.databaseSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 10_000,
    };
};
exports.pool = new pg_1.Pool(getPoolConfig());
const initializeDatabase = async () => {
    await exports.pool.query("SELECT 1");
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await exports.pool.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await exports.pool.query("CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)");
    await exports.pool.query("CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title)");
    await exports.pool.query("CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC)");
};
exports.initializeDatabase = initializeDatabase;
const closeDatabase = async () => {
    await exports.pool.end();
};
exports.closeDatabase = closeDatabase;
