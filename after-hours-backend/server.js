// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/postRoutes.js";

import mongoose from "mongoose";
import User from "./model/userModel.js";
import Post from "./model/postModel.js";

dotenv.config();

// --- Connect to MongoDB ---
connectDB();

// --- Automatic cleanup of expired-trial posts ---
const cleanupExpiredPosts = async () => {
  try {
    const expiredUsers = await User.find({
      trialEnd: { $lt: new Date() },
      subscriber: false,
    });

    if (!expiredUsers.length) {
      console.log("No expired-trial users found for cleanup.");
      return;
    }

    const expiredIds = expiredUsers.map((u) => u._id);

    const deleted = await Post.deleteMany({
      user: { $in: expiredIds },
    });

    console.log(`Auto-cleanup: Deleted ${deleted.deletedCount} posts from expired users.`);
  } catch (err) {
    console.error("Auto-cleanup error:", err);
  }
};

const app = express();

// --- CORS setup ---
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// --- Middleware ---
// --- Middleware ---
// Increase the limit to 10MB (or more) to handle base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// --- API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

// --- Global error handler ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

// --- Create HTTP server ---
const server = http.createServer(app);

// --- Socket.IO with CORS ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- Start server with cleanup ---
const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected...");

  // Run cleanup before server starts
  await cleanupExpiredPosts();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
