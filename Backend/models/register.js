import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, },
});

const Register = mongoose.model("Register", registerSchema);

export default Register;
