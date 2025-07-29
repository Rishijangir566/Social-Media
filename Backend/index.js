import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";

import authRouter from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import ChatRoom from "./models/Message.js"; // Make sure schema is updated
import messageRoutes from "./routes/message.js";

const app = express();
const server = http.createServer(app);

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", authRouter);
app.use("/api/users", userRoutes);
app.use("/messages", messageRoutes);

// Connect DB
connectDB();

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    const { room, sender, text, time } = data;

    try {
      // Check if room exists
      let chatRoom = await ChatRoom.findOne({ roomId: room });

      if (!chatRoom) {
        chatRoom = new ChatRoom({
          roomId: room,
          participants: [sender], // Optionally include the receiver
          messages: [],
        });
      }

      // Add new message
      chatRoom.messages.push({ sender, text, time: new Date() });
      await chatRoom.save();

      // Broadcast message
      io.to(room).emit("receive_message", {
        sender,
        text,
        time,
      });
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
