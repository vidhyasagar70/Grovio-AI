"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const postgres_1 = require("./db/postgres");
const start = async () => {
    await (0, postgres_1.initializeDatabase)();
    const server = app_1.default.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Backend listening on http://localhost:${env_1.env.port}`);
    });
    const shutdown = async () => {
        server.close();
        await (0, postgres_1.closeDatabase)();
    };
    process.on("SIGINT", () => {
        void shutdown().finally(() => process.exit(0));
    });
    process.on("SIGTERM", () => {
        void shutdown().finally(() => process.exit(0));
    });
};
void start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend.", error);
    process.exitCode = 1;
});
