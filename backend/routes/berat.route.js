import express from "express";
import { createBerat, deleteBerat, getBerat, updateBerat } from "../controllers/berat.controller.js";


const router= express.Router();

router.post("/", createBerat);
router.get("/", getBerat);
router.get("/:id", getBerat);
router.put("/:id", updateBerat);
router.delete("/:id", deleteBerat);

export default router