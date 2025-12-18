import mongoose from "mongoose"; // <-- 1. Changed to import

const musicSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    artist: { type: String },
  },
  { timestamps: true }
);

// 2. Changed to export default
export default mongoose.model("Music", musicSchema);