import express from "express";
import { registerUser, loginUser, verifyOtpAndRegister } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtpAndRegister)

export default router;
