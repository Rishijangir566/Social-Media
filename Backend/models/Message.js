// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     room: { type: String, required: true },
//     sender: { type: String, required: true }, // uniqueId
//     text: { type: String, required: true },
//     time: { type: String }, // optional, or use Date
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", messageSchema);


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  text: { type: String },
  time: { type: String }, // optional or use timestamps
});

const chatRoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true }, // e.g., user1-user2
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    messages: [messageSchema], // Array of messages
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema);

