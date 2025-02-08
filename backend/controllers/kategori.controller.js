import mongoose from "mongoose";
import Kategori from "../models/kategori.model.js";

const validateInput = (input) => {
  return typeof input === 'string' && input.trim().length > 0;
};

export const createKategori = async (req, res) => {
  const { nama } = req.body;

  if (!validateInput(nama)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid nama value" });
  }

  const newKategori = new Kategori({ nama: nama.trim() });
  try {
    await newKategori.save();
    return res.status(201).json({ success: true, kategori: newKategori });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getKategori = async (req, res) => {
  try {
    if (req.params.id) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid ID format" });
      }

      const kategori = await Kategori.findOne({
        _id: { $eq: req.params.id }
      });
      if (!kategori) {
        return res
          .status(404)
          .json({ success: false, message: "Kategori not found" });
      }
      return res.status(200).json({ success: true, kategori });
    } else {
      const kategoris = await Kategori.find({});
      return res.status(200).json({ success: true, kategoris });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateKategori = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  if (!validateInput(nama)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid nama value" });
  }

  try {
    const updatedKategori = await Kategori.findOneAndUpdate(
      { _id: { $eq: id } },
      { nama: nama.trim() },
      { new: true }
    );
    
    if (!updatedKategori) {
      return res
        .status(404)
        .json({ success: false, message: "Kategori not found" });
    }
    
    return res.status(200).json({ success: true, kategori: updatedKategori });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteKategori = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    const deletedKategori = await Kategori.findOneAndDelete({
      _id: { $eq: id }
    });

    if (!deletedKategori) {
      return res
        .status(404)
        .json({ success: false, message: "Kategori not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Kategori deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
