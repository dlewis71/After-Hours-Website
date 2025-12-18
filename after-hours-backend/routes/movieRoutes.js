
import express from "express";
import { createMovie, getMovies } from "../controller/movieController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All movie routes require login
router.post("/", protect, createMovie); // Add movie
router.get("/", protect, getMovies);    // Get all movies

// This line is correct!
export default router;