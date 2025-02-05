import express from 'express';
import { 
    getCheckout, 
    createCheckout, 
    updateCheckout, 
    deleteCheckout, 
    uploadBuktiTransfer,
    getCheckoutsByProfile
} from "../controllers/checkout.controller.js";
import upload, { compressImage } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getCheckout);
router.get('/:id', getCheckout);
router.get('/profile/:profileId', getCheckoutsByProfile);
// Create checkout without bukti transfer
router.post('/', createCheckout);
// Separate endpoint for uploading bukti transfer
router.post('/:id/bukti-transfer', upload.single('file'), compressImage, uploadBuktiTransfer);
router.patch('/:id', updateCheckout);
router.delete('/:id', deleteCheckout);

export default router;