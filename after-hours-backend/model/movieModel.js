import mongoose from "mongoose"; // <-- THE FINAL FIX

const movieSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);