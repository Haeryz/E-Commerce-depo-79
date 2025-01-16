import mongoose from "mongoose";
import Alamat from "../models/alamat.model.js"; // Assuming the model is named 'alamats.model.js'

export const getAlamat = async (req, res) => {
  try {
    if (req.params.id) {
      const alamat = await Alamat.findById(req.params.id);
      if (!alamat) {
        return res
          .status(404)
          .json({ success: false, message: "Alamat not found" });
      }
      return res.status(200).json({ success: true, alamat });
    } else {
      const alamats = await Alamat.find();
      return res.status(200).json({ success: true, alamats }); // Added "return" for consistency
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message }); // Added "return" for consistency
  }
};

export const createAlamat = async (req, res) => {
  const { user, provinsi, kota, kecamatan, kelurahan, kodepos, detail } =
    req.body;

  if (!user || !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All required fields must be provided",
      });
  }

  const newAlamat = new Alamat({
    user,
    provinsi,
    kota,
    kecamatan,
    kelurahan,
    kodepos,
    detail,
  });

  try {
    await newAlamat.save();
    return res.status(201).json({ success: true, alamat: newAlamat });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAlamat = async (req, res) => {
  const { id } = req.params;
  const { user, provinsi, kota, kecamatan, kelurahan, kodepos, detail } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Alamat not found" });
  }

  const updatedAlamat = {
    user,
    provinsi,
    kota,
    kecamatan,
    kelurahan,
    kodepos,
    detail,
    _id: id,
  };

  try {
    await Alamat.findByIdAndUpdate(id, updatedAlamat, { new: true });
    return res.status(200).json({ success: true, alamat: updatedAlamat });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAlamat = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Alamat not found" });
  }

  try {
    await Alamat.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Alamat deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
