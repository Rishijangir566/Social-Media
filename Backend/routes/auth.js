import express from "express";
const router = express.Router();

import {
  updateProfile,
  handleRegister,
  handleLogin,
  handleShareData,
  verifyEmail,
  githubAuthorization,
  googleAuthorization,
  linkedinAuthorization,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", handleRegister);
router.get("/verify/:token", verifyEmail);
router.post("/login", handleLogin);
router.post("/github/callback", githubAuthorization);
router.post("/google/callback", googleAuthorization);
router.post("/linkedin/callback", linkedinAuthorization);
router.put("/profile", protect, upload.single("profilePic"), updateProfile);
router.post("/shareData", protect, upload.single("postImage"), handleShareData);
export default router;
