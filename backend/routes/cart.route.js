import express from "express";
import { getCart, addToCart, removeFromCart, updateCart } from "../controllers/cart.controller.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all cart routes with verifyToken middleware
router.use(verifyToken);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:productId", removeFromCart);

// Add this new route
router.put("/:productId", updateCart);

export default router;
