import type {
  CreateNoteInput,
  ListNotesParams,
  Note,
  PaginationResult,
  UpdateNoteInput,
} from "../types/note";
import { pool } from "../db/postgres";

type NoteRow = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export class NoteRepository {
  public async list(userId: number, params: ListNotesParams): Promise<PaginationResult<Note>> {
    const offset = (params.page - 1) * params.limit;
    const hasSearch = typeof params.search === "string" && params.search.trim().length > 0;
    const normalizedSearch = `%${params.search?.trim() ?? ""}%`;

    const whereClause = hasSearch
      ? "WHERE user_id = $1 AND (title ILIKE $2 OR content ILIKE $2)"
      : "WHERE user_id = $1";

    const totalResult = await pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM notes ${whereClause}`,
      hasSearch ? [userId, normalizedSearch] : [userId],
    );

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

    const listResult = await pool.query<NoteRow>(
      listQuery,
      hasSearch ? [userId, normalizedSearch, params.limit, offset] : [userId, params.limit, offset],
    );

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

  public async getById(id: number, userId: number): Promise<Note | null> {
    const result = await pool.query<NoteRow>(
      `
        SELECT
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
        FROM notes
        WHERE id = $1 AND user_id = $2
      `,
      [id, userId],
    );

    return result.rows[0] ?? null;
  }

  public async create(userId: number, input: CreateNoteInput): Promise<Note> {
    const result = await pool.query<NoteRow>(
      `
        INSERT INTO notes (user_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING
          id,
          user_id,
          title,
          content,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `,
      [userId, input.title, input.content],
    );

    return result.rows[0];
  }

  public async update(id: number, userId: number, input: UpdateNoteInput): Promise<Note | null> {
    const existing = await this.getById(id, userId);
    if (!existing) {
      return null;
    }

    const updatedTitle = input.title ?? existing.title;
    const updatedContent = input.content ?? existing.content;

    const result = await pool.query<NoteRow>(
      `
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
      `,
      [updatedTitle, updatedContent, id, userId],
    );

    return result.rows[0] ?? null;
  }

  public async delete(id: number, userId: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
