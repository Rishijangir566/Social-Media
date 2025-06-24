import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  name: { type: String },
  userName: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String },
  oauthProvider: { type: String, default: null },
  oauthId: { type: String, default: null },
  profileUrl: { type: String, default: "" },
  url: { type: String, default: "" },
});

registerSchema.index({ email: 1, oauthProvider: 1 }, { unique: true });

const Register = mongoose.model("Register", registerSchema);

export default Register;
