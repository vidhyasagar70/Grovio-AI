import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export const initializeDatabase = (dbPath: string): Database.Database => {
  const dbDirectory = path.dirname(dbPath);

  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }

  const db = new Database(dbPath);

  // Enable important pragmas
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");

  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    console.log("✓ Users table created");
  } catch (err) {
    console.log("✓ Users table already exists");
  }

  try {
    // Create users email index
    db.exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
    console.log("✓ Users email index created");
  } catch (err) {
    console.log("✓ Users email index already exists");
  }

  try {
    // Create notes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✓ Notes table created");
  } catch (err) {
    console.log("✓ Notes table already exists");
  }

  try {
    // Create notes indexes
    db.exec("CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)");
    console.log("✓ Notes user_id index created");
  } catch (err) {
    console.log("✓ Notes user_id index already exists");
  }

  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title)");
    console.log("✓ Notes title index created");
  } catch (err) {
    console.log("✓ Notes title index already exists");
  }

  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC)");
    console.log("✓ Notes updated_at index created");
  } catch (err) {
    console.log("✓ Notes updated_at index already exists");
  }

  return db;
};
