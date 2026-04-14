import { Router } from "express";
import { NoteController } from "../controllers/noteController";

const noteRoutes = Router();

noteRoutes.get("/", NoteController.list);
noteRoutes.get("/:id", NoteController.getOne);
noteRoutes.post("/", NoteController.create);
noteRoutes.put("/:id", NoteController.update);
noteRoutes.delete("/:id", NoteController.delete);

export default noteRoutes;
