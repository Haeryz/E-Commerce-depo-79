import express from "express";
import { createKategori, deleteKategori, getKategori, updateKategori } from "../controllers/kategori.controller.js";

const router = express.Router();

router.post("/", createKategori);
router.get("/", getKategori);
router.get("/:id", getKategori);
router.put("/:id", updateKategori);
router.delete("/:id", deleteKategori);

export default router