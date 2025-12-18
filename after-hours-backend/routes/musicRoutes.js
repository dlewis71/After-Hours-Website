import express from "express";
import { createMusic, getMusic } from "../controller/musicController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All music routes require login
router.post("/", protect, createMusic); // Add music
router.get("/", protect, getMusic);     // Get all music

// This line is correct!
export default router;