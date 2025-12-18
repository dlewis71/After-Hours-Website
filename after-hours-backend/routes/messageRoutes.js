import express from "express";
import { sendMessage, getMessages } from "../controller/messageController.js";
// FIX: Changed from default import (import protect) to named import ({ protect })
// to match the export in authMiddleware.js.
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// POST /api/messages/
// Sends a new message. The receiver is in the request body.
router.post("/", protect, sendMessage);

// GET /api/messages/:userId
// Gets the chat history with a specific user.
router.get("/:userId", protect, getMessages);

export default router;