"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapZodError = exports.NoteController = void 0;
const zod_1 = require("zod");
const noteService_1 = require("../services/noteService");
const apiResponse_1 = require("../utils/apiResponse");
const appError_1 = require("../utils/appError");
const listSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
    search: zod_1.z.string().optional(),
});
const noteIdSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
const createSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(200),
    content: zod_1.z.string().trim().default(""),
});
const updateSchema = zod_1.z
    .object({
    title: zod_1.z.string().trim().min(1).max(200).optional(),
    content: zod_1.z.string().trim().optional(),
})
    .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "At least one field (title or content) must be provided.",
});
const noteService = new noteService_1.NoteService();
class NoteController {
    static async list(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new appError_1.AppError("User not authenticated", 401);
            }
            const query = listSchema.parse(req.query);
            const notes = await noteService.listNotes(userId, query);
            res.status(200).json((0, apiResponse_1.ok)(notes));
        }
        catch (error) {
            next(error);
        }
    }
    static async getOne(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new appError_1.AppError("User not authenticated", 401);
            }
            const { id } = noteIdSchema.parse(req.params);
            const note = await noteService.getNoteById(userId, id);
            res.status(200).json((0, apiResponse_1.ok)(note));
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new appError_1.AppError("User not authenticated", 401);
            }
            const payload = createSchema.parse(req.body);
            const note = await noteService.createNote(userId, payload);
            res.status(201).json((0, apiResponse_1.ok)(note, "Note created successfully."));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new appError_1.AppError("User not authenticated", 401);
            }
            const { id } = noteIdSchema.parse(req.params);
            const payload = updateSchema.parse(req.body);
            const note = await noteService.updateNote(userId, id, payload);
            res.status(200).json((0, apiResponse_1.ok)(note, "Note updated successfully."));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new appError_1.AppError("User not authenticated", 401);
            }
            const { id } = noteIdSchema.parse(req.params);
            await noteService.deleteNote(userId, id);
            res.status(200).json((0, apiResponse_1.ok)(null, "Note deleted successfully."));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NoteController = NoteController;
const mapZodError = (error) => {
    if (error instanceof zod_1.z.ZodError) {
        return new appError_1.AppError(error.issues[0]?.message ?? "Validation error.", 400);
    }
    return null;
};
exports.mapZodError = mapZodError;
