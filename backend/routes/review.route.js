import express from "express";
import { createReview, deleteReview, getReviews, updateReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReviews);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router