import express from "express";
import ChatRoom from "../models/Message.js";
// import Profile from "../models/Profile.js"; // Assuming this is your user model

const router = express.Router();

// 🔴 Add this POST route to support chat start
router.post("/", async (req, res) => {
  const { user1, user2 } = req.body;
  console.log(user1, user2);

  try {
    // Generate consistent roomId based on user IDs
    const sortedIds = [user1, user2].sort();
    const roomId = `${sortedIds[0]}-${sortedIds[1]}`;

    // Check if room already exists
    let room = await ChatRoom.findOne({ roomId });
    console.log(room);

    if (!room) {
      // Create new room
      room = new ChatRoom({
        roomId,
        participants: sortedIds,
        messages: [],
      });
      await room.save();
    }

    res.json({ roomId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error starting chat", error: err.message });
  }
});

router.get("/:roomId", async (req, res) => {
  console.log("first");
  console.log(req.params.roomId);
  const sortID = req.params.roomId;

  try {
    const room = await ChatRoom.findOne({ roomId: sortID });
    console.log(room);

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json(room); // ✅ Return full room object
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
