import mongoose from "mongoose";

const userPostSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
    },
    hashtags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userPost = mongoose.model("userPost", userPostSchema);
export default userPost;
