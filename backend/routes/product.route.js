import express from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/products.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router