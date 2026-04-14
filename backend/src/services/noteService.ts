import { AppError } from "../utils/appError";
import { NoteRepository } from "../repositories/noteRepository";
import type {
  CreateNoteInput,
  ListNotesParams,
  PaginationResult,
  Note,
  UpdateNoteInput,
} from "../types/note";

export class NoteService {
  private readonly repository: NoteRepository;

  constructor(repository?: NoteRepository) {
    this.repository = repository ?? new NoteRepository();
  }

  public async listNotes(userId: number, params: ListNotesParams): Promise<PaginationResult<Note>> {
    return this.repository.list(userId, params);
  }

  public async getNoteById(userId: number, id: number): Promise<Note> {
    const note = await this.repository.getById(id, userId);
    if (!note) {
      throw new AppError("Note not found.", 404);
    }
    return note;
  }

  public async createNote(userId: number, input: CreateNoteInput): Promise<Note> {
    return this.repository.create(userId, input);
  }

  public async updateNote(userId: number, id: number, input: UpdateNoteInput): Promise<Note> {
    const updated = await this.repository.update(id, userId, input);
    if (!updated) {
      throw new AppError("Note not found.", 404);
    }
    return updated;
  }

  public async deleteNote(userId: number, id: number): Promise<void> {
    const deleted = await this.repository.delete(id, userId);
    if (!deleted) {
      throw new AppError("Note not found.", 404);
    }
  }
}
