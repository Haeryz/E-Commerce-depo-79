import mongoose from "mongoose";
import Berat from "../models/berat.model.js";

export const getBerat = async (req, res) => {
  try {
    if (req.params.id) {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid ID format" 
        });
      }

      // Use $eq operator to prevent query injection
      const berat = await Berat.findOne({ 
        _id: { $eq: req.params.id } 
      });

      if (!berat) {
        return res.status(404).json({ 
          success: false, 
          message: "Berat not found" 
        });
      }
      return res.status(200).json({ success: true, berat });
    } else {
      const berats = await Berat.find({});
      return res.status(200).json({ success: true, berats });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBerat = async (req, res) => {
  try {
    const { nama } = req.body;

    // Validate input type and content
    if (!nama || typeof nama !== 'string' || nama.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Nama must be a non-empty string" 
      });
    }

    const newBerat = new Berat({ nama: nama.trim() });
    await newBerat.save();
    return res.status(201).json({ success: true, berat: newBerat });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBerat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid ID format" 
      });
    }

    // Validate input type and content
    if (!nama || typeof nama !== 'string' || nama.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Nama must be a non-empty string" 
      });
    }

    // Use $eq operator and find the document first
    const berat = await Berat.findOne({ _id: { $eq: id } });
    if (!berat) {
      return res.status(404).json({ 
        success: false, 
        message: "Berat not found" 
      });
    }

    const updatedBerat = await Berat.findByIdAndUpdate(
      id,
      { nama: nama.trim() },
      { new: true }
    );
    
    return res.status(200).json({ success: true, berat: updatedBerat });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBerat = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid ID format" 
      });
    }

    // Use $eq operator and find the document first
    const berat = await Berat.findOne({ _id: { $eq: id } });
    if (!berat) {
      return res.status(404).json({ 
        success: false, 
        message: "Berat not found" 
      });
    }

    await Berat.findByIdAndRemove(id);
    return res.status(200).json({ 
      success: true, 
      message: "Berat deleted successfully" 
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
