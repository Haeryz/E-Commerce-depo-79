import express from "express";
import { registerUser, loginUser, verifyOtpAndRegister, registerAdmin } from "../controllers/auth.controller.js";
import { validateAdminCreation } from '../middleware/adminMiddleware.js';
import verifyToken from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for admin creation - updated configuration
const adminCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3, // Changed 'max' to 'limit' as per new version
  message: { 
    success: false,
    message: 'Too many admin creation attempts, please try again later'
  }
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtpAndRegister)

// Admin registration route with multiple security layers
router.post(
  "/register-admin",
  adminCreateLimiter,
  verifyToken,
  validateAdminCreation,
  registerAdmin
);

export default router;
