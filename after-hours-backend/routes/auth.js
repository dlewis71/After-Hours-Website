import express from "express";
// Import signupUser and loginUser from userController
import { signupUser as registerUser, loginUser } from "../controller/userController.js";

const router = express.Router();

// --- Register a new user ---
// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (err) {
    next(err);
  }
});

// --- Login an existing user ---
// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    await loginUser(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
