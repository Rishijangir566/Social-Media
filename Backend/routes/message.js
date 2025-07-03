import express from "express";
import { sendMessage, getMessages } from "../controllers/messagerequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:withUserId", protect, getMessages);

export default router;