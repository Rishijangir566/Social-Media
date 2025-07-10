import express from "express";
import {
  acceptRequest,
  fetchProfileData,
  findAllPosts,
  findAllProfiles,
  findUserName,
  getFriendRequestData,
  getMe,
  handleLogout,
  rejectRequest,
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

router.get("/all-request/:userId", protect, fetchProfileData);
router.put("/accept/:requestId", protect, acceptRequest);
router.put("/reject/:requestId", protect, rejectRequest);

router.get("/check-username", findUserName);
router.get("/logout", handleLogout);
export default router;
