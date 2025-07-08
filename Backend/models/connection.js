        import mongoose, { Schema } from "mongoose";

        const connection = new Schema(
        {
            uniqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile", // Reference to your Register collection
            required: true,
            unique: true, // This ensures one connection document per user
            },

            // Sent connection requests (pending)
            sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],

            // Received connection requests (pending)
            receivedRequests: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
            ],

            // Accepted connections
            connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
        },
        { timestamps: true }
        );

        const friendRequest = mongoose.model("friendRequest", connection);
        export default friendRequest;
