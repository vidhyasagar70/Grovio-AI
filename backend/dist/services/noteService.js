"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const appError_1 = require("../utils/appError");
const noteRepository_1 = require("../repositories/noteRepository");
class NoteService {
    repository;
    constructor(repository) {
        this.repository = repository ?? new noteRepository_1.NoteRepository();
    }
    async listNotes(userId, params) {
        return this.repository.list(userId, params);
    }
    async getNoteById(userId, id) {
        const note = await this.repository.getById(id, userId);
        if (!note) {
            throw new appError_1.AppError("Note not found.", 404);
        }
        return note;
    }
    async createNote(userId, input) {
        return this.repository.create(userId, input);
    }
    async updateNote(userId, id, input) {
        const updated = await this.repository.update(id, userId, input);
        if (!updated) {
            throw new appError_1.AppError("Note not found.", 404);
        }
        return updated;
    }
    async deleteNote(userId, id) {
        const deleted = await this.repository.delete(id, userId);
        if (!deleted) {
            throw new appError_1.AppError("Note not found.", 404);
        }
    }
}
exports.NoteService = NoteService;
