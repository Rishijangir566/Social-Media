import express from "express";
import {
  findAllProfiles,
  getMe,
} from "../controllers/authController.js";
import { checkToken, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", protect, getMe);
router.get("/checkToken", checkToken);
router.get("/allprofiles", findAllProfiles);
export default router;
