import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/postRoutes.js";
import videoRoutes from "./routes/movieRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// Import middleware
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- Middleware ---
app.use(cors({
  origin: "http://localhost:5173",  // React dev server
  credentials: true,
}));
app.use(express.json());

// --- API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/messages", messageRoutes);

// --- Temporary test route to verify backend is reachable ---
app.get("/ping", (req, res) => res.send("pong"));

// --- Error Handling ---
app.use(errorHandler);

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
