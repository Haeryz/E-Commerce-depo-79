import express from 'express';
import { createProfile, deleteProfile, getAllProfiles, getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.post("/", createProfile);
router.get("/account", getProfile);
router.get("/account/:id", getProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);
router.get("/", getAllProfiles);

export default router;