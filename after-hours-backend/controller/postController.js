import Post from "../model/postModel.js";
import User from "../model/userModel.js";

// GET all posts
export const getPosts = async (req, res, next) => {
  try {
    // Auto-cleanup expired-trial posts for the logged-in user
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user.trialEnd && new Date() > user.trialEnd && !user.subscriber) {
        await Post.deleteMany({ user: req.user.id });
      }
    }

    const posts = await Post.find({}).populate("user", "username"); // populate username
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// CREATE post
export const createPost = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id);

    // Check if trial expired
    if (user.trialEnd && new Date() > user.trialEnd && !user.subscriber) {
      // Delete all posts of this user if trial expired
      await Post.deleteMany({ user: req.user.id });
      return res.status(403).json({
        message: "Your trial has expired. All your posts were removed."
      });
    }

    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user: req.user.id, // associate post with logged-in user
    });

    const populatedPost = await post.populate("user", "username"); // populate username
    res.status(201).json(populatedPost);
  } catch (err) {
    next(err);
  }
};

// UPDATE post
export const updatePost = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(post, req.body);
    await post.save();

    const populatedPost = await post.populate("user", "username");
    res.json(populatedPost);
  } catch (err) {
    next(err);
  }
};

// DELETE post
export const deletePost = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.user || post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne(); // safer than remove()
    console.log(`Post ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    next(err);
  }
};
