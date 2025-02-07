import mongoose from "mongoose";
import Struk from "../models/struk.model.js";
import Checkout from "../models/checkout.model.js";

export const getStruk = async (req, res) => {
  try {
    if (req.params.id) {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid struk ID format"
        });
      }

      // Use $eq operator for safe comparison
      const struk = await Struk.findOne({
        _id: { $eq: req.params.id }
      });

      if (!struk) {
        return res.status(404).json({ 
          success: false, 
          message: "Struk not found" 
        });
      }
      return res.status(200).json({ success: true, struk });
    } else {
      const struks = await Struk.find({});  // Using empty object for safety
      return res.status(200).json({ success: true, struks });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createStruk = async (req, res) => {
  try {
    const { nama_kasir, checkout_id } = req.body;

    // Validate input
    if (!nama_kasir || !nama_kasir.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "nama_kasir is required" 
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(checkout_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid checkout ID format"
      });
    }

    // Sanitize input
    const sanitizedNamaKasir = nama_kasir.trim();

    // Find the checkout using $eq operator
    const checkout = await Checkout.findOne({
      _id: { $eq: checkout_id }
    }).populate('items.product');

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    // Generate safe struk number
    const strukNumber = `STR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newStruk = new Struk({
      nomor_struk: strukNumber,
      checkout: checkout_id,
      items: checkout.items.map(item => ({
        product: item.product._id, // Ensure we're using the ObjectId
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.quantity) * Number(item.price)
      })),
      total: Number(checkout.grandTotal),
      payment_method: checkout.pembayaran,
      nama_kasir: sanitizedNamaKasir,
      customer_name: (checkout.nama_lengkap || 'Guest').trim()
    });

    const savedStruk = await newStruk.save();

    // Update checkout with struk reference using $set
    await Checkout.findOneAndUpdate(
      { _id: { $eq: checkout_id } },
      { $set: { struk: savedStruk._id } },
      { new: true }
    );

    return res.status(201).json({ 
      success: true, 
      struk: savedStruk 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateStruk = async (req, res) => {
  const { id } = req.params;
  const { nama_kasir, checkout_id } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid struk ID format" 
    });
  }

  // Validate input
  if (checkout_id && !mongoose.Types.ObjectId.isValid(checkout_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid checkout ID format"
    });
  }

  try {
    // Prepare update object with only valid fields
    const updateObj = {};
    if (nama_kasir) updateObj.nama_kasir = nama_kasir.trim();
    if (checkout_id) updateObj.checkout = checkout_id;

    // Use findOneAndUpdate with $set operator
    const updatedStruk = await Struk.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: updateObj },
      { new: true }
    );

    if (!updatedStruk) {
      return res.status(404).json({
        success: false,
        message: "Struk not found"
      });
    }

    return res.status(200).json({ 
      success: true, 
      struk: updatedStruk 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStruk = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid struk ID format" 
    });
  }

  try {
    // Use findOneAndDelete with $eq operator
    const deletedStruk = await Struk.findOneAndDelete({
      _id: { $eq: id }
    });

    if (!deletedStruk) {
      return res.status(404).json({
        success: false,
        message: "Struk not found"
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Struk deleted successfully" 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
