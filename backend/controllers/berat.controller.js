import mongoose from "mongoose";
import Berat from "../models/berat.model.js";

export const getBerat = async (req, res) => {
  try {
    if (req.params.id) {
      const berat = await Berat.findById(req.params.id);
      if (!berat) {
        return res
          .status(404)
          .json({ success: false, message: "Berat not found" });
      }
      return res.status(200).json({ success: true, berat });
    } else {
      const berats = await Berat.find();
      return res.status(200).json({ success: true, berats }); // Added "return" for consistency
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message }); // Added "return" for consistency
  }
};

export const createBerat = async (req, res) => {
  const { nama } = req.body;

  if (!nama) {
    return res
      .status(400)
      .json({ success: false, message: "Nama is required" });
  }
  const newBerat = new Berat({ nama });
  try {
    await newBerat.save();
    return res.status(201).json({ success: true, berat: newBerat });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBerat = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Berat not found" });
  }

  const updatedBerat = { nama, _id: id };

  try {
    await Berat.findByIdAndUpdate(id, updatedBerat, { new: true });
    return res.status(200).json({ success: true, berat: updatedBerat });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBerat = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Berat not found" });
  }

  try {
    await Berat.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Berat deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
