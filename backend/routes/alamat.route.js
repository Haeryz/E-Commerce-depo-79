import express from 'express';
import { createAlamat, deleteAlamat, getAlamat, updateAlamat } from '../controllers/alamat.controller.js';

const router = express.Router();

router.post("/", createAlamat);
router.get("/", getAlamat);
router.get("/:id", getAlamat);
router.put("/:id", updateAlamat);
router.delete("/:id", deleteAlamat);

export default router;

