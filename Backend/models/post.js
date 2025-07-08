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
    userName: {
      type: String,
    },
    profilePic: {
      type: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Register",
      },
    ],

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Register",
        },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userPost = mongoose.model("userPost", userPostSchema);
export default userPost;
