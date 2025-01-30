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
    const { 
      nama, 
      pembayaran, 
      cartId,
      alamat_lengkap,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      kodepos
    } = req.body;

    // Validate required fields (removed bukti transfer requirement)
    if (!nama || !pembayaran || !cartId || !alamat_lengkap || 
        !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get cart and verify profile
    const cart = await Cart.findById(cartId).populate('items.product');
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const profileExists = await mongoose.model('Profile').findById(nama);
    if (!profileExists) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Create new checkout with pending status for Transfer payments
    const newCheckout = new Checkout({
      buktiTransfer: "",  // Always empty initially
      nama,
      pembayaran,
      status: pembayaran === "Transfer" ? "Pending" : "Belum Dibayar", // New status flow
      grandTotal: cart.total,
      alamat_lengkap,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      kodepos
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

// Add a new endpoint to upload bukti transfer later
export const uploadBuktiTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { pembayaran } = req.body; // Add this line to get payment method

    // Validate payment method
    if (!pembayaran || !['Transfer', 'COD'].includes(pembayaran)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Must be either 'Transfer' or 'COD'"
      });
    }

    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    // Handle payment method update
    checkout.pembayaran = pembayaran;

    // If Transfer, require and process bukti transfer
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

      checkout.buktiTransfer = uploadResult.url;
      checkout.status = "Menunggu Konfirmasi";
    } else {
      // For COD
      checkout.buktiTransfer = "";
      checkout.status = "Belum Dibayar";
    }

    await checkout.save();

    return res.status(200).json({
      success: true,
      checkout
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const updateCheckout = async (req, res) => {
  const { id } = req.params;
  const { 
    status, 
    pembayaran,
    alamat_lengkap,
    provinsi,
    kota,
    kecamatan,
    kelurahan,
    kodepos
  } = req.body;

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
    if (alamat_lengkap) checkout.alamat_lengkap = alamat_lengkap;
    if (provinsi) checkout.provinsi = provinsi;
    if (kota) checkout.kota = kota;
    if (kecamatan) checkout.kecamatan = kecamatan;
    if (kelurahan) checkout.kelurahan = kelurahan;
    if (kodepos) checkout.kodepos = kodepos;

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
