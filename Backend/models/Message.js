import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },
    sender: { type: String, required: true }, // uniqueId
    text: { type: String, required: true },
    time: { type: String }, // optional, or use Date
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);


