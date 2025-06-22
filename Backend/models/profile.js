import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  uniqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
  },
  userName: { type: String },
  email: { type: String, required: true },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  gender: { type: String, default: "" },
  dob: { type: String, default: "" },
  Address: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  oauthProvider: { type: String, default: null },
  firstTimeSignIn: {
    type: Boolean,
    default: false,
  },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
