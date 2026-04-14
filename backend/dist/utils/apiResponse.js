"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = void 0;
const ok = (data, message) => ({
    success: true,
    data,
    ...(message ? { message } : {}),
});
exports.ok = ok;
