"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("./postgres");
const run = async () => {
    await (0, postgres_1.initializeDatabase)();
    // eslint-disable-next-line no-console
    console.log("Database migration completed successfully.");
    await (0, postgres_1.closeDatabase)();
};
void run().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Database migration failed.", error);
    process.exitCode = 1;
});
