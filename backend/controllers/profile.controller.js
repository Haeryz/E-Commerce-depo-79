import mongoose from "mongoose";
import Profile from "../models/profile.model.js"; // Assuming the model is named 'profile.model.js'

export const getProfile = async (req, res) => {
  try {
    if (req.params.id) {
      const profile = await Profile.findById(req.params.id)
        .populate("User") // Populating User reference
        .populate("alamat"); // Populating Alamat reference
      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }
      return res.status(200).json({ success: true, profile });
    } else {
      const profiles = await Profile.find()
        .populate("User") // Populating User reference
        .populate("alamat"); // Populating Alamat reference
      return res.status(200).json({ success: true, profiles }); // Added "return" for consistency
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message }); // Added "return" for consistency
  }
};

export const createProfile = async (req, res) => {
  const { User, nama, nomorhp, alamat, jeniskelamin } = req.body;

  if (!User || !nama || !nomorhp || !alamat || !jeniskelamin) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All required fields must be provided",
      });
  }

  const newProfile = new Profile({ User, nama, nomorhp, alamat, jeniskelamin });

  try {
    await newProfile.save();
    return res.status(201).json({ success: true, profile: newProfile });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { User, nama, nomorhp, alamat, jeniskelamin } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }

  const updatedProfile = { User, nama, nomorhp, alamat, jeniskelamin, _id: id };

  try {
    await Profile.findByIdAndUpdate(id, updatedProfile, { new: true });
    return res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }

  try {
    await Profile.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};