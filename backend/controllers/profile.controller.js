import mongoose from "mongoose";
import Profile from "../models/profile.model.js";
import jwt from "jsonwebtoken"; // Assuming the model is named 'profile.model.js'

export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded ID:", decoded.id); // Log user ID

    const userId = decoded.id;
    const profile = await Profile.findOne({ User: userId })
      .populate("User") // Populate user correctly
      .populate("alamat"); // Populate alamat if needed

    if (!profile) {
      console.error("Profile not found");
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProfile = async (req, res) => {
  const { User, nama, nomorhp, alamat, jeniskelamin } = req.body;

  if (!User || !nama || !nomorhp || !alamat || !jeniskelamin) {
    return res.status(400).json({
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
