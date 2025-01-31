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
      cartId,
      nama_lengkap,
      Email,
      nomor_telefon,
      alamat_lengkap,
      provinsi,
      kota,
      kecamatan,
      kelurahan,  // This field is empty in your request
      kodepos
    } = req.body;

    // Log the request body for debugging
    console.log('Received checkout data:', req.body);

    // Validate required fields (removed pembayaran)
    if (!nama || !cartId || !alamat_lengkap || 
        !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
      console.log('Missing fields:', {
        nama: !!nama,
        cartId: !!cartId,
        alamat_lengkap: !!alamat_lengkap,
        provinsi: !!provinsi,
        kota: !!kota,
        kecamatan: !!kecamatan,
        kelurahan: !!kelurahan, // This is false because it's empty
        kodepos: !!kodepos
      });
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate email format if provided
    if (Email && !/\S+@\S+\.\S+/.test(Email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate phone number if provided
    if (nomor_telefon && nomor_telefon.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 12 characters"
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

    // Create new checkout with pending status
    const newCheckout = new Checkout({
      buktiTransfer: "",
      nama,
      nama_lengkap: nama_lengkap || "",
      Email: Email || "",
      nomor_telefon: nomor_telefon || "",
      pembayaran: "Pending",  // Set initial payment method as Pending
      status: "Pending", // All orders start as pending
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
    const { pembayaran } = req.body;

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

    // Prevent changing payment method if already set
    if (checkout.pembayaran !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Payment method already set and cannot be changed"
      });
    }

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
    nama_lengkap,
    Email,
    nomor_telefon,
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

    // Validate email format if being updated
    if (Email && !/\S+@\S+\.\S+/.test(Email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate phone number if being updated
    if (nomor_telefon && nomor_telefon.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 12 characters"
      });
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

    // Update all allowed fields
    if (status) checkout.status = status;
    if (pembayaran) checkout.pembayaran = pembayaran;
    if (nama_lengkap) checkout.nama_lengkap = nama_lengkap;
    if (Email) checkout.Email = Email;
    if (nomor_telefon) checkout.nomor_telefon = nomor_telefon;
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
