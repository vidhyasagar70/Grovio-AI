import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

// POST /auth/signup - Register a new user
router.post("/signup", (req, res) => {
  void authController.signup(req, res);
});

// POST /auth/login - Login user
router.post("/login", (req, res) => {
  void authController.login(req, res);
});

export default router;
