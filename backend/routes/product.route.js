import express from "express";
import { 
  createProduct, 
  deleteProduct, 
  getProductById, 
  getProducts, 
  updateProduct,
  searchProducts  // Add this import
} from "../controllers/products.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts); // Add this new route
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router