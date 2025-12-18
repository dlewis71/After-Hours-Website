import express from "express";
import slugify from "slugify";
import Blog from "../model/Blog.js"; // FIXED: Changed path from '../models/Blog.js' (plural) to '../model/Blog.js' (singular)
import { protect } from "../middleware/authMiddleware.js";
import mongoose from "mongoose"; // ADDED: Import Mongoose to access ObjectId utilities

const router = express.Router();

// GET all blogs (Populates author and replies for full conversation flow)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username") // Populate author of the post
      .populate({
        path: "replies", // Populate the replies array
        populate: { path: "author", select: "username" }, // Populate the author of each reply
      })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// GET single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "username")
      .populate({
        path: "replies",
        populate: { path: "author", select: "username" },
      });

    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// POST new blog (protected) - Includes Unique Slug Generation
router.post("/", protect, async (req, res) => {
  try {
    // ADDED: Safety check for authenticated user object
    if (!req.user || !req.user._id) return res.status(401).json({ error: "Authentication required." }); 
    
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // CRITICAL FIX: Ensure slug is unique to prevent database crash (E11000)
    while (await Blog.exists({ slug: slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    // CRITICAL FIX: Ensure ID is converted to a Mongoose ObjectId when saving
    const newBlog = new Blog({ 
      title, 
      content, 
      slug, 
      author: new mongoose.Types.ObjectId(req.user._id) // <--- USES ROBUST Mongoose ID
    });
    await newBlog.save();

    // Populate author information before sending the response
    await newBlog.populate("author", "username");

    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// POST new reply to a specific blog post (protected)
router.post("/:id/replies", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ error: "Authentication required." });

    const postId = req.params.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Reply content is required" });

    const newReply = {
      content,
      author: new mongoose.Types.ObjectId(req.user._id), // Uses robust Mongoose ID
      createdAt: new Date(),
    };

    // FIX: Use an atomic $push operation for safety and efficiency
    const result = await Blog.updateOne(
      { _id: postId },
      { $push: { replies: newReply } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(201).json({ message: "Reply added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post reply" });
  }
});

// PUT update blog by ID (protected)
router.put("/:id", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ error: "Authentication required." });
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    
    // CRITICAL FIX: Use Mongoose's .equals() for reliable ID comparison
    if (!blog.author.equals(req.user._id)) return res.status(403).json({ error: "Not authorized" }); 

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE blog by ID (protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ error: "Authentication required." });

    // STEP 1: Find the blog post to ensure authorization check
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // STEP 2: CRITICAL FIX: Authorization check using Mongoose equals()
    if (!blog.author.equals(req.user._id)) return res.status(403).json({ error: "Not authorized" });

    // STEP 3: Delete the post using the modern method
    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;