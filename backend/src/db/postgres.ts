import { Pool } from "pg";
import { env } from "../config/env";

const getPoolConfig = (): ConstructorParameters<typeof Pool>[0] => {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required for Postgres.");
  }

  return {
    connectionString: env.databaseUrl,
    ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  };
};

export const pool = new Pool(getPoolConfig());

export const initializeDatabase = async (): Promise<void> => {
  await pool.query("SELECT 1");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query("CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title)");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC)");
};

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
};