import jwt from "jsonwebtoken";
import Register from "../models/register.js";

export const protect = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Register.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const checkToken = (req, res) => {
  const { token } = req.cookies;
  // console.log("Token is", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      decoded,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
