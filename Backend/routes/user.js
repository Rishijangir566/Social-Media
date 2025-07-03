import express from "express";
import {
  acceptRequest,
  findAllPosts,
  findAllProfiles,
  findUserName,
  getMe,
  handleLogout,
  rejectRequest,
  requestIdDetail,
  sendRequest,

  
} from "../controllers/authController.js";
import { checkToken, protect } from "../middleware/authMiddleware.js";
const router = express.Router();
  
router.get("/me", protect, getMe);
router.get("/checkToken", checkToken);
router.get("/allprofiles", findAllProfiles);
router.get("/allposts", findAllPosts);
router.post("/send_request/:receiverId",protect, sendRequest)
router.put("/accept/:requestId",protect, acceptRequest)
router.put("/reject/:requestId",protect, rejectRequest)
router.get("/request/:requestId",protect,requestIdDetail)
router.get("/check-username", findUserName);
router.get("/logout",handleLogout)
export default router;
