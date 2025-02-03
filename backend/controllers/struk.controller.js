import mongoose from "mongoose";
import Struk from "../models/struk.model.js";
import Checkout from "../models/checkout.model.js";

export const getStruk = async (req, res) => {
  try {
    if (req.params.id) {
      const struk = await Struk.findById(req.params.id);
      if (!struk) {
        return res
          .status(404)
          .json({ success: false, message: "Struk not found" });
      }
      return res.status(200).json({ success: true, struk });
    } else {
      const struks = await Struk.find();
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
    if (!nama_kasir || !checkout_id) {
      return res.status(400).json({ 
        success: false, 
        message: "nama_kasir and checkout_id are required" 
      });
    }

    // Find the checkout to get its details
    const checkout = await Checkout.findById(checkout_id).populate('items.product');
    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    const newStruk = new Struk({
      nomor_struk: `STR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      checkout: checkout_id,
      items: checkout.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })),
      total: checkout.grandTotal,
      payment_method: checkout.pembayaran,
      nama_kasir: nama_kasir,
      customer_name: checkout.nama_lengkap || 'Guest'
    });

    await newStruk.save();

    // Update checkout with struk reference
    checkout.struk = newStruk._id;
    await checkout.save();

    return res.status(201).json({ 
      success: true, 
      struk: newStruk 
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
  const { struk, nama_kasir, checkout_id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Struk not found" });
  }

  const updatedStruk = { struk, nama_kasir, checkout_id, _id: id };
  try {
    await Struk.findByIdAndUpdate(id, updatedStruk, { new: true });
    return res.status(200).json({ success: true, struk: updatedStruk });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStruk = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Struk not found" });
  }

  await Struk.findByIdAndRemove(id);
  return res
    .status(200)
    .json({ success: true, message: "Struk deleted successfully" });
};
