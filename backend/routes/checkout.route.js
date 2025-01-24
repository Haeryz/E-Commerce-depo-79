import express from 'express';
import { getCheckout, createCheckout, updateCheckout, deleteCheckout } from "../controllers/checkout.controller.js";
import upload, { compressImage } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getCheckout);
router.get('/:id', getCheckout);
router.post('/', upload.single('buktiTransfer'), compressImage, createCheckout);
router.put('/:id', upload.single('buktiTransfer'), compressImage, updateCheckout);
router.delete('/:id', deleteCheckout);

export default router;