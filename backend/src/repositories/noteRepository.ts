import db from "../db/sqlite";
import type {
  CreateNoteInput,
  ListNotesParams,
  Note,
  PaginationResult,
  UpdateNoteInput,
} from "../types/note";

export class NoteRepository {
  public list(userId: number, params: ListNotesParams): PaginationResult<Note> {
    const offset = (params.page - 1) * params.limit;
    const hasSearch = typeof params.search === "string" && params.search.trim().length > 0;
    const normalizedSearch = `%${params.search?.trim() ?? ""}%`;

    const whereClause = hasSearch
      ? "WHERE user_id = ? AND (title LIKE ? OR content LIKE ?)"
      : "WHERE user_id = ?";

    const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM notes ${whereClause}`);

    const listStmt = db.prepare(
      `
        SELECT id, user_id, title, content, created_at, updated_at
        FROM notes
        ${whereClause}
        ORDER BY datetime(updated_at) DESC
        LIMIT ? OFFSET ?
      `,
    );

    const totalRow = hasSearch
      ? (totalStmt.get(userId, normalizedSearch, normalizedSearch) as { total: number })
      : (totalStmt.get(userId) as { total: number });

    const items = hasSearch
      ? (listStmt.all(userId, normalizedSearch, normalizedSearch, params.limit, offset) as Note[])
      : (listStmt.all(userId, params.limit, offset) as Note[]);

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

  public getById(id: number, userId: number): Note | null {
    const stmt = db.prepare(
      "SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?",
    );
    return (stmt.get(id, userId) as Note | undefined) ?? null;
  }

  public create(userId: number, input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const insertStmt = db.prepare(
      "INSERT INTO notes (user_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    );
    const result = insertStmt.run(userId, input.title, input.content, now, now);
    const created = this.getById(Number(result.lastInsertRowid), userId);

    if (!created) {
      throw new Error("Failed to fetch newly created note.");
    }

    return created;
  }

  public update(id: number, userId: number, input: UpdateNoteInput): Note | null {
    const existing = this.getById(id, userId);
    if (!existing) {
      return null;
    }

    const updatedTitle = input.title ?? existing.title;
    const updatedContent = input.content ?? existing.content;
    const now = new Date().toISOString();

    const updateStmt = db.prepare(
      "UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    );
    updateStmt.run(updatedTitle, updatedContent, now, id, userId);

    return this.getById(id, userId);
  }

  public delete(id: number, userId: number): boolean {
    const stmt = db.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }
}
