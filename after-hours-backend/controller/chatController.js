const Message = require("../models/messageModel");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const message = new Message({ sender: req.user._id, receiver, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get chat history between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
