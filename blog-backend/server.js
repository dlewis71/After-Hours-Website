// server.js
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;
const DATA_FILE = "./posts.json";

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Load posts from file
let posts = [];
if (fs.existsSync(DATA_FILE)) {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  posts = JSON.parse(data || "[]");
}

// Save helper
const savePosts = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
};

// --- Routes ---

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Create new post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author)
    return res.status(400).json({ error: "Missing fields" });

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author,
    date: new Date().toISOString().split("T")[0],
  };

  posts.push(newPost);
  savePosts();
  res.status(201).json(newPost);
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter((p) => p.id !== id);
  savePosts();
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
