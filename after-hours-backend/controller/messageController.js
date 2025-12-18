import Message from "../model/messageModel.js";

/**
 * Send a message and emit it via Socket.IO
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, text } = req.body;
    const sender = req.user._id;

    // Create and save the new message
    let newMessage = await Message.create({
      sender,
      receiver,
      text,
    });

    // Populate the sender's info to send a complete object via socket
    newMessage = await newMessage.populate("sender", "username profilePicture");

    // --- Real-Time Emission via Socket.IO ---
    const io = req.app.get("socketio"); // Get the io instance
    // Emit to a room named after the receiver's user ID
    io.to(receiver).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    // Pass errors to the central error handler
    next(err);
  }
};

/**
 * Get paginated chat history between two users with populated user data
 */
export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;

    // --- Pagination ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId },
      ],
    })
      // Sort descending to get the newest messages for the page
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      // --- Populate User Data ---
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    // Reverse the array to send it in chronological order (oldest to newest)
    res.status(200).json(messages.reverse());
  } catch (err) {
    // Pass errors to the central error handler
    next(err);
  }
};