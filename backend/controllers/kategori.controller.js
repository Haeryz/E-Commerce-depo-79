import mongoose from "mongoose";
import Kategori from "../models/kategori.model.js";

export const createKategori = async (req, res) => {
  const { nama } = req.body;

  if (!nama) {
    return res
      .status(400)
      .json({ success: false, message: "Nama is required" });
  }
  const newKategori = new Kategori({ nama });
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
      const kategori = await Kategori.findById(req.params.id);
      if (!kategori) {
        return res
          .status(404)
          .json({ success: false, message: "Kategori not found" });
      }
      return res.status(200).json({ success: true, kategori });
    } else {
      const kategoris = await Kategori.find();
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
      .status(404)
      .json({ success: false, message: "Kategori not found" });
  }

  const updatedKategori = { nama, _id: id };
  try {
    await Kategori.findByIdAndUpdate(id, updatedKategori, { new: true });
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
      .status(404)
      .json({ success: false, message: "Kategori not found" });
  }

  try {
    await Kategori.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Kategori deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
