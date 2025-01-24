import mongoose from "mongoose";
import Chekcout from "../models/checkout.model.js";
import { uploadImage } from "../services/cloudinary.service.js";

export const getCheckout = async (req, res) => {
  try {
    if (req.params.id) {
      const checkout = await Chekcout.findById(req.params.id);
      if (!checkout) {
        return res
          .status(404)
          .json({ success: false, message: "Checkout not found" });
      }
      return res.status(200).json({ success: true, checkout });
    } else {
      const checkouts = await Chekcout.find();
      return res.status(200).json({ success: true, checkouts });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCheckout = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Bukti Transfer image is required" 
      });
    }

    // Convert buffer to base64
    const fileStr = req.file.buffer.toString('base64');
    const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;

    // Upload to Cloudinary
    const uploadResult = await uploadImage(fileUri, {
      folder: 'bukti-transfer',
    });

    if (!uploadResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: "Failed to upload image" 
      });
    }

    // Create new checkout with Cloudinary URL
    const newCheckout = new Chekcout({
      buktiTransfer: uploadResult.url
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
  const { buktiTransfer } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Checkout not found" });
  }

  const updatedCheckout = { buktiTransfer, _id: id };
  try {
    await Chekcout.findByIdAndUpdate(id, updatedCheckout, { new: true });
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
    await Chekcout.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Checkout deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
