// routes/user.js
import express from "express";
import { signupUser, loginUser, getUser, updateUser } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Public routes ---
router.post("/register", signupUser);
router.post("/login", loginUser);

// --- Protected routes (only access/update own profile) ---
router.get("/profile", protect, getUser);   // Get current user's profile
router.put("/profile", protect, updateUser); // Update current user's profile

export default router;
