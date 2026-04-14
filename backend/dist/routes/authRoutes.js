"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST /auth/signup - Register a new user
router.post("/signup", (req, res) => {
    void authController_1.authController.signup(req, res);
});
// POST /auth/login - Login user
router.post("/login", (req, res) => {
    void authController_1.authController.login(req, res);
});
exports.default = router;
