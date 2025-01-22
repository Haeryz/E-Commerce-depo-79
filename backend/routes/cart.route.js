import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes should be protected and require authentication
router.use(verifyToken);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:productId", removeFromCart);

export default router;
