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

  public listNotes(userId: number, params: ListNotesParams): PaginationResult<Note> {
    return this.repository.list(userId, params);
  }

  public getNoteById(userId: number, id: number): Note {
    const note = this.repository.getById(id, userId);
    if (!note) {
      throw new AppError("Note not found.", 404);
    }
    return note;
  }

  public createNote(userId: number, input: CreateNoteInput): Note {
    return this.repository.create(userId, input);
  }

  public updateNote(userId: number, id: number, input: UpdateNoteInput): Note {
    const updated = this.repository.update(id, userId, input);
    if (!updated) {
      throw new AppError("Note not found.", 404);
    }
    return updated;
  }

  public deleteNote(userId: number, id: number): void {
    const deleted = this.repository.delete(id, userId);
    if (!deleted) {
      throw new AppError("Note not found.", 404);
    }
  }
}
