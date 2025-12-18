const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);

// Add this exact line to the very end of route/movieRoutes.js
export default router;
