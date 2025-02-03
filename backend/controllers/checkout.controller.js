import mongoose from "mongoose";
import Checkout from "../models/checkout.model.js";  // Fixed typo
import Cart from "../models/cart.model.js";
import { uploadImage } from "../services/cloudinary.service.js";
import { getIO } from '../socket.js';

export const getCheckout = async (req, res) => {
  try {
    if (req.params.id) {
      const checkout = await Checkout.findById(req.params.id)
        .populate('items.product', 'nama harga_jual'); // Add populate here
      if (!checkout) {
        return res
          .status(404)
          .json({ success: false, message: "Checkout not found" });
      }
      return res.status(200).json({ success: true, checkout });
    } else {
      const checkouts = await Checkout.find()
        .populate('items.product', 'nama harga_jual'); // Add populate here
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
      kodepos,
      items,
      total
    } = req.body;

    // Log the request body for debugging
    console.log('Received checkout data:', req.body);

    // Validate required fields (removed pembayaran)
    if (!nama || (!cartId && !items) || !alamat_lengkap || 
        !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
      console.log('Missing fields:', {
        nama: !!nama,
        cartId: !!cartId,
        items: !!items,
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

    let checkoutItems = items;

    if (cartId) {
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

      // Transform cart items for checkout
      checkoutItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.harga_jual // assuming this is the price field
      }));

      // Optionally clear the cart or mark it as checked out
      await Cart.findByIdAndUpdate(cartId, { 
        $set: { 
          items: [],
          total: 0
        }
      });
    }

    // Create new checkout with pending status and items
    const newCheckout = new Checkout({
      buktiTransfer: "",
      nama,
      nama_lengkap: nama_lengkap || "",
      Email: Email || "",
      nomor_telefon: nomor_telefon || "",
      pembayaran: "Pending",  // Set initial payment method as Pending
      status: "Pending", // All orders start as pending
      grandTotal: total,
      items: checkoutItems, // Add the items here
      alamat_lengkap,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      kodepos
    });

    await newCheckout.save();

    // Populate the items before sending response
    const populatedCheckout = await Checkout.findById(newCheckout._id)
      .populate('items.product');

    // Emit event after successful checkout creation
    getIO().emit('newCheckout', populatedCheckout);

    return res.status(201).json({
      success: true,
      checkout: populatedCheckout
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
    
    // Populate the checkout before emitting
    const populatedCheckout = await Checkout.findById(checkout._id)
      .populate('items.product', 'nama harga_jual');
    
    // Emit the updated checkout
    getIO().emit('checkoutUpdated', populatedCheckout);

    return res.status(200).json({
      success: true,
      checkout: populatedCheckout
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
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Checkout not found" });
  }

  try {
    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({ success: false, message: "Checkout not found" });
    }

    // Validate status transition
    if (status) {
      // Handle transitions from "Menunggu Konfirmasi"
      if (checkout.status === "Menunggu Konfirmasi") {
        if (!["Dikirim", "Ditolak"].includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid status transition from Menunggu Konfirmasi"
          });
        }
      } 
      // Handle transition from "Dikirim" to "Selesai"
      else if (checkout.status === "Dikirim") {
        if (status !== "Selesai") {
          return res.status(400).json({
            success: false,
            message: "Can only transition to Selesai from Dikirim status"
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid status transition"
        });
      }
      
      checkout.status = status;
    }

    await checkout.save();
    
    // Populate the items before sending response
    const updatedCheckout = await Checkout.findById(id)
      .populate('items.product', 'nama harga_jual');
      
    // Emit event after successful update
    getIO().emit('checkoutUpdated', updatedCheckout);
    
    return res.status(200).json({ success: true, checkout: updatedCheckout });
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

export const getCheckoutsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const checkouts = await Checkout.find({ nama: profileId })
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      checkouts 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
