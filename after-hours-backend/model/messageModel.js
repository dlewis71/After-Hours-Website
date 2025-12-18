import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, required: true },
    recipient: { type: String, default: "Group" }, // Either a username or "Group"
    time: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt/updatedAt fields
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
