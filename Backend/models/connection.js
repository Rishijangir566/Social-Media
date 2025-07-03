import mongoose, { Schema } from "mongoose";

const connection = new Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum:["accept","pending","reject"]
    }
}, { timestamps: true })


const friendRequest = mongoose.model("friendRequest", connection)
export default friendRequest;