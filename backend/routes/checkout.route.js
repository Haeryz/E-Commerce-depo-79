import express from 'express';
import { 
    getCheckout, 
    createCheckout, 
    updateCheckout, 
    deleteCheckout, 
    uploadBuktiTransfer,
    getCheckoutsByProfile,
    searchCheckouts
} from "../controllers/checkout.controller.js";
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getCheckout);
router.get('/:id', getCheckout);
router.get('/profile/:profileId', getCheckoutsByProfile);
router.get('/search/query', searchCheckouts);
// Create checkout without bukti transfer
router.post('/', createCheckout);
// Separate endpoint for uploading bukti transfer - removed compressImage middleware
router.post('/:id/bukti-transfer', upload.single('file'), uploadBuktiTransfer);
router.patch('/:id', updateCheckout);
router.delete('/:id', deleteCheckout);

export default router;