import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  oauthProvider: { type: String, default: null },
  oauthId: { type: String, default: null },
  profileUrl: { type: String, default: "" },
});

const Register = mongoose.model("Register", registerSchema);

export default Register;
