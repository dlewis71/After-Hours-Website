import express from "express";
import { 
  getPosts, 
  createPost, 
  updatePost, 
  deletePost 
} from "../controller/postController.js";

import { protect } from "../middleware/authMiddleware.js";
import User from "../model/userModel.js";
import Post from "../model/postModel.js";

const router = express.Router();

// -----------------------------
// MAIN BLOG ROUTES
// -----------------------------
router.get("/", getPosts);
router.post("/", protect, createPost);          // create post
router.put("/:id", protect, updatePost);        // edit post
router.delete("/:id", protect, deletePost);     // delete post


// -----------------------------
// NEW FEATURE:
// Delete ALL posts from users whose trial expired
// -----------------------------
router.delete("/cleanup/expired", protect, async (req, res) => {
  try {
    // Find all users whose trial expired and they did NOT subscribe
    const expiredUsers = await User.find({
      trialActive: false,
      subscribed: false
    });

    if (!expiredUsers.length) {
      return res.json({ deletedCount: 0, message: "No expired users found." });
    }

    const expiredIds = expiredUsers.map(u => u._id);

    // Delete all posts owned by expired users
    const deleted = await Post.deleteMany({
      "user._id": { $in: expiredIds }
    });

    return res.json({
      deletedCount: deleted.deletedCount,
      message: "Expired-trial user posts cleaned up."
    });

  } catch (err) {
    console.error("Cleanup error:", err);
    return res.status(500).json({ message: "Server error cleaning expired posts." });
  }
});

// -----------------------------
export default router;
