import express from "express";
import { checkToken, getMe } from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", protect, getMe);
router.get("/checkToken",checkToken)

export default router;
