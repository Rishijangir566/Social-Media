import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";

import authRouter from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import Message from "./models/Message.js";
import messageRoutes from "./routes/message.js";


const app = express();
const server = http.createServer(app); // wrap Express with HTTP server

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // same as your CORS config
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRouter);
app.use("/api/users", userRoutes);
app.use("/messages", messageRoutes);

// DB connect
connectDB();

// --- SOCKET.IO LOGIC ---

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("send_message", async (data) => {
    console.log("✉️ Message received:", data);

    try {
      // ✅ Save message to DB
      const newMessage = new Message({
        room: data.room,
        sender: data.sender,
        text: data.text,
        time: data.time, // optional — or just use createdAt
      });

      await newMessage.save();

      // ✅ Broadcast to others in the room
      socket.to(data.room).emit("receive_message", data);
    } catch (err) {
      console.error("❌ Failed to save message:", err);
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
