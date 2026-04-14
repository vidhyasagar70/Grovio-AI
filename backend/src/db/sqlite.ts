import { env } from "../config/env";
import { initializeDatabase } from "./init";

const db = initializeDatabase(env.dbPath);

export default db;
