import express from "express";

import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.js";
import userRoutes from "./routes/user.js";
// import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// ✅ Define corsOptions here
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Define routes
app.use("/user", authRouter);
app.use("/api/users", userRoutes);

// ✅ Connect to DB and start server
connectDB();

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("join chat", ({ userId, friendId }) => {
//     const roomId = `room_${userId}_${friendId}`;
//     socket.join(roomId);
//     console.log(`User ${userId} joined room: ${roomId}`);
//   });

//   socket.on("private message", (data) => handlePrivateMessage(data, io));

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
