import mongoose from "mongoose";
import Checkout from "../models/checkout.model.js";  // Fixed typo
import Cart from "../models/cart.model.js";
import { uploadImage } from "../services/cloudinary.service.js";

export const getCheckout = async (req, res) => {
  try {
    if (req.params.id) {
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) {
        return res
          .status(404)
          .json({ success: false, message: "Checkout not found" });
      }
      return res.status(200).json({ success: true, checkout });
    } else {
      const checkouts = await Checkout.find();
      return res.status(200).json({ success: true, checkouts });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCheckout = async (req, res) => {
  try {
    const { nama, pembayaran, cartId } = req.body;

    // Validate required fields
    if (!nama || !pembayaran || !cartId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get cart total
    const cart = await Cart.findById(cartId).populate('items.product');
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // Handle file upload if payment method is Transfer
    let buktiTransferUrl = null;
    if (pembayaran === "Transfer") {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Bukti Transfer image is required for transfer payment"
        });
      }

      const fileStr = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;

      const uploadResult = await uploadImage(fileUri, {
        folder: 'bukti-transfer',
      });

      if (!uploadResult.success) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image"
        });
      }

      buktiTransferUrl = uploadResult.url;
    }

    // Create new checkout with proper initial status and cart total
    const newCheckout = new Checkout({
      buktiTransfer: buktiTransferUrl || "",  // Empty string for COD
      nama,
      pembayaran,
      status: pembayaran === "COD" ? "Belum Dibayar" : "Dibayar",  // Set initial status based on payment method
      grandTotal: cart.total
    });

    await newCheckout.save();
    return res.status(201).json({
      success: true,
      checkout: newCheckout
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCheckout = async (req, res) => {
  const { id } = req.params;
  const { status, pembayaran } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Checkout not found" });
  }

  try {
    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({ success: false, message: "Checkout not found" });
    }

    // Handle new bukti transfer if payment method changes to Transfer
    if (pembayaran === "Transfer" && req.file) {
      const fileStr = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;

      const uploadResult = await uploadImage(fileUri, {
        folder: 'bukti-transfer',
      });

      if (uploadResult.success) {
        checkout.buktiTransfer = uploadResult.url;
      }
    }

    // Update allowed fields
    if (status) checkout.status = status;
    if (pembayaran) checkout.pembayaran = pembayaran;

    await checkout.save();
    return res.status(200).json({ success: true, checkout });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCheckout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Checkout not found" });
  }

  try {
    await Checkout.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Checkout deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
