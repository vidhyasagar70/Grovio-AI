"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
app_1.default.listen(env_1.env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${env_1.env.port}`);
});
