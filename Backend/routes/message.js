import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Get chat history for a room
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ room: roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
