import { closeDatabase, initializeDatabase } from "./postgres";

const run = async (): Promise<void> => {
	await initializeDatabase();
	// eslint-disable-next-line no-console
	console.log("Database migration completed successfully.");
	await closeDatabase();
};

void run().catch((error: unknown) => {
	// eslint-disable-next-line no-console
	console.error("Database migration failed.", error);
	process.exitCode = 1;
});
