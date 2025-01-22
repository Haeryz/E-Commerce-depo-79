import express from 'express';
import { getCheckout, createCheckout, updateCheckout, deleteCheckout } from "../controllers/checkout.controller.js";

const router = express.Router();
router.get('/', getCheckout);
router.get('/:id', getCheckout);
router.post('/', createCheckout);
router.put('/:id', updateCheckout);
router.delete('/:id', deleteCheckout);

export default router;