"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./sqlite");
// Schema creation runs when sqlite module is loaded.
// This script gives an explicit migration command for CI/local setup.
// eslint-disable-next-line no-console
console.log("Database migration completed successfully.");
