import type { Response, NextFunction } from "express";
import { z } from "zod";
import { NoteService } from "../services/noteService";
import { ok } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import type { AuthRequest } from "../middleware/authMiddleware";

const listSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
});

const noteIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().default(""),
});

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "At least one field (title or content) must be provided.",
  });

const noteService = new NoteService();

export class NoteController {
  public static async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const query = listSchema.parse(req.query);
      const notes = await noteService.listNotes(userId, query);
      res.status(200).json(ok(notes));
    } catch (error) {
      next(error);
    }
  }

  public static async getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = noteIdSchema.parse(req.params);
      const note = await noteService.getNoteById(userId, id);
      res.status(200).json(ok(note));
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const payload = createSchema.parse(req.body);
      const note = await noteService.createNote(userId, payload);
      res.status(201).json(ok(note, "Note created successfully."));
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = noteIdSchema.parse(req.params);
      const payload = updateSchema.parse(req.body);
      const note = await noteService.updateNote(userId, id, payload);
      res.status(200).json(ok(note, "Note updated successfully."));
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = noteIdSchema.parse(req.params);
      await noteService.deleteNote(userId, id);
      res.status(200).json(ok(null, "Note deleted successfully."));
    } catch (error) {
      next(error);
    }
  }
}

export const mapZodError = (error: unknown): AppError | null => {
  if (error instanceof z.ZodError) {
    return new AppError(error.issues[0]?.message ?? "Validation error.", 400);
  }
  return null;
};
