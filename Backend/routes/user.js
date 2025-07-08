import express from "express";
import {
  findAllPosts,
  findAllProfiles,
  findUserName,
  getFriendRequestData,
  getMe,
  handleLogout,
  sendFriendRequest,
} from "../controllers/authController.js";
import { checkToken, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", protect, getMe);
router.get("/checkToken", checkToken);
router.get("/allprofiles", findAllProfiles);
router.get("/allposts", findAllPosts);

router.post("/send_request/:receiverId", protect, sendFriendRequest);
router.get("/request/:userId", protect, getFriendRequestData);

router.get("/check-username", findUserName);
router.get("/logout", handleLogout);
export default router;
