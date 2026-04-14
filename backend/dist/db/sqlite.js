"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const init_1 = require("./init");
const db = (0, init_1.initializeDatabase)(env_1.env.dbPath);
exports.default = db;
