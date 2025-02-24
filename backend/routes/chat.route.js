import express from "express";
import { getChatHistory, getAllRooms } from "../controllers/chat.controller.js";

const router = express.Router();

// Temporarily removed isAuthenticated middleware for testing
router.get("/rooms", getAllRooms);
router.get("/history/:room", getChatHistory);

export default router;
