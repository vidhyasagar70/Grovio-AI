"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRepository = void 0;
const sqlite_1 = __importDefault(require("../db/sqlite"));
class NoteRepository {
    list(userId, params) {
        const offset = (params.page - 1) * params.limit;
        const hasSearch = typeof params.search === "string" && params.search.trim().length > 0;
        const normalizedSearch = `%${params.search?.trim() ?? ""}%`;
        const whereClause = hasSearch
            ? "WHERE user_id = ? AND (title LIKE ? OR content LIKE ?)"
            : "WHERE user_id = ?";
        const totalStmt = sqlite_1.default.prepare(`SELECT COUNT(*) as total FROM notes ${whereClause}`);
        const listStmt = sqlite_1.default.prepare(`
        SELECT id, user_id, title, content, created_at, updated_at
        FROM notes
        ${whereClause}
        ORDER BY datetime(updated_at) DESC
        LIMIT ? OFFSET ?
      `);
        const totalRow = hasSearch
            ? totalStmt.get(userId, normalizedSearch, normalizedSearch)
            : totalStmt.get(userId);
        const items = hasSearch
            ? listStmt.all(userId, normalizedSearch, normalizedSearch, params.limit, offset)
            : listStmt.all(userId, params.limit, offset);
        const totalPages = Math.max(1, Math.ceil(totalRow.total / params.limit));
        return {
            items,
            pagination: {
                page: params.page,
                limit: params.limit,
                total: totalRow.total,
                totalPages,
            },
        };
    }
    getById(id, userId) {
        const stmt = sqlite_1.default.prepare("SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?");
        return stmt.get(id, userId) ?? null;
    }
    create(userId, input) {
        const now = new Date().toISOString();
        const insertStmt = sqlite_1.default.prepare("INSERT INTO notes (user_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
        const result = insertStmt.run(userId, input.title, input.content, now, now);
        const created = this.getById(Number(result.lastInsertRowid), userId);
        if (!created) {
            throw new Error("Failed to fetch newly created note.");
        }
        return created;
    }
    update(id, userId, input) {
        const existing = this.getById(id, userId);
        if (!existing) {
            return null;
        }
        const updatedTitle = input.title ?? existing.title;
        const updatedContent = input.content ?? existing.content;
        const now = new Date().toISOString();
        const updateStmt = sqlite_1.default.prepare("UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND user_id = ?");
        updateStmt.run(updatedTitle, updatedContent, now, id, userId);
        return this.getById(id, userId);
    }
    delete(id, userId) {
        const stmt = sqlite_1.default.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
        const result = stmt.run(id, userId);
        return result.changes > 0;
    }
}
exports.NoteRepository = NoteRepository;
