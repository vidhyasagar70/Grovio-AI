import app from "./app";
import { env } from "./config/env";
import { closeDatabase, initializeDatabase } from "./db/postgres";

const start = async (): Promise<void> => {
  await initializeDatabase();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${env.port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close();
    await closeDatabase();
  };

  process.on("SIGINT", () => {
    void shutdown().finally(() => process.exit(0));
  });

  process.on("SIGTERM", () => {
    void shutdown().finally(() => process.exit(0));
  });
};

void start().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend.", error);
  process.exitCode = 1;
});
