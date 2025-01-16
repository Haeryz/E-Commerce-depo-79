import express from 'express';
import { createProfile, deleteProfile, getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.post("/", createProfile);
router.get("/", getProfile);
router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;