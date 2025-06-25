import express from "express";
import {
  findAllProfiles,
  getMe,
  getPendingRequests,
  handleConnectionRequest,
  sendConnectionRequest,
} from "../controllers/authController.js";
import { checkToken, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", protect, getMe);
router.get("/checkToken", checkToken);
router.get("/allprofiles", findAllProfiles);
router.post("/connection/send-request",protect, sendConnectionRequest);
router.get("/connection/pending",protect, getPendingRequests);
router.post("/connection/handle-request",protect, handleConnectionRequest);
export default router;
