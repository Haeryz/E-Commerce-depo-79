import mongoose from "mongoose";
import Alamat from "../models/alamat.model.js";

export const getAlamat = async (req, res) => {
  try {
    if (req.params.id) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }
      
      const alamat = await Alamat.findOne({
        _id: { $eq: req.params.id }
      });
      
      if (!alamat) {
        return res.status(404).json({
          success: false,
          message: "Alamat not found"
        });
      }
      
      return res.status(200).json({ success: true, alamat });
    }

    const alamats = await Alamat.find({}).limit(100);
    return res.status(200).json({ success: true, alamats });
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching address"
    });
  }
};

export const createAlamat = async (req, res) => {
  try {
    const { user, provinsi, kota, kecamatan, kelurahan, kodepos, detail } = req.body;

    // Validate required fields
    if (!user || !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Validate postal code format (numbers only, specific length)
    if (!/^\d{5}$/.test(kodepos)) {
      return res.status(400).json({
        success: false,
        message: "Invalid postal code format"
      });
    }

    // Create new address with validated data
    const newAlamat = new Alamat({
      user,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      kodepos,
      detail: detail || ""
    });

    await newAlamat.save();
    return res.status(201).json({ success: true, alamat: newAlamat });
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating address"
    });
  }
};

export const updateAlamat = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, provinsi, kota, kecamatan, kelurahan, kodepos, detail } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    // Validate required fields
    if (!user || !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Validate postal code format
    if (!/^\d{5}$/.test(kodepos)) {
      return res.status(400).json({
        success: false,
        message: "Invalid postal code format"
      });
    }

    const updatedAlamat = await Alamat.findOneAndUpdate(
      { _id: { $eq: id } },
      {
        $set: {
          user,
          provinsi,
          kota,
          kecamatan,
          kelurahan,
          kodepos,
          detail: detail || ""
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedAlamat) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    return res.status(200).json({ success: true, alamat: updatedAlamat });
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating address"
    });
  }
};

export const deleteAlamat = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const deletedAlamat = await Alamat.findOneAndDelete({
      _id: { $eq: id }
    });

    if (!deletedAlamat) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting address"
    });
  }
};
