"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRepository = void 0;
const postgres_1 = require("../db/postgres");
class NoteRepository {
    async list(userId, params) {
        const offset = (params.page - 1) * params.limit;
        const hasSearch = typeof params.search === "string" && params.search.trim().length > 0;
        const normalizedSearch = `%${params.search?.trim() ?? ""}%`;
        const whereClause = hasSearch
            ? "WHERE user_id = $1 AND (title ILIKE $2 OR content ILIKE $2)"
            : "WHERE user_id = $1";
        const totalResult = await postgres_1.pool.query(`SELECT COUNT(*)::int AS total FROM notes ${whereClause}`, hasSearch ? [userId, normalizedSearch] : [userId]);
        const listQuery = hasSearch
            ? `
        SELECT
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM notes
        ${whereClause}
        ORDER BY updated_at DESC, id DESC
        LIMIT $3 OFFSET $4
      `
            : `
        SELECT
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM notes
        ${whereClause}
        ORDER BY updated_at DESC, id DESC
        LIMIT $2 OFFSET $3
      `;
        const listResult = await postgres_1.pool.query(listQuery, hasSearch ? [userId, normalizedSearch, params.limit, offset] : [userId, params.limit, offset]);
        const total = totalResult.rows[0]?.total ?? 0;
        const totalPages = Math.max(1, Math.ceil(total / params.limit));
        return {
            items: listResult.rows,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages,
            },
        };
    }
    async getById(id, userId) {
        const result = await postgres_1.pool.query(`
        SELECT
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM notes
        WHERE id = $1 AND user_id = $2
      `, [id, userId]);
        return result.rows[0] ?? null;
    }
    async create(userId, input) {
        const result = await postgres_1.pool.query(`
        INSERT INTO notes (user_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `, [userId, input.title, input.content]);
        return result.rows[0];
    }
    async update(id, userId, input) {
        const existing = await this.getById(id, userId);
        if (!existing) {
            return null;
        }
        const updatedTitle = input.title ?? existing.title;
        const updatedContent = input.content ?? existing.content;
        const result = await postgres_1.pool.query(`
        UPDATE notes
        SET title = $1, content = $2, updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `, [updatedTitle, updatedContent, id, userId]);
        return result.rows[0] ?? null;
    }
    async delete(id, userId) {
        const result = await postgres_1.pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [id, userId]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.NoteRepository = NoteRepository;
