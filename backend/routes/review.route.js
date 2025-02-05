import express from "express";
import upload from '../middleware/upload.middleware.js';
import { 
    createReview, 
    deleteReview, 
    getReviews,
    getCheckoutReviews,
    updateReview,
    getUnreviewedProducts 
} from "../controllers/review.controller.js";

const router = express.Router();

// GET unreviewed products
router.get("/unreviewed/:checkoutId", getUnreviewedProducts);

// Standard CRUD routes
router.post("/", upload.single('image'), createReview);
router.get("/", getReviews);
router.get("/checkout/:checkoutId", getCheckoutReviews);
router.get("/:id", getReviews);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;