import mongoose from "mongoose";
import Profile from "../models/profile.model.js";
import jwt from "jsonwebtoken";

// Helper function to validate input
const sanitizeInput = (data) => {
  if (typeof data === 'object' && data !== null) {
    // Prevent object injection
    return String(data);
  }
  return data;
};

export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Use $eq operator to prevent injection
    const profile = await Profile.findOne({ 
      User: { $eq: userId } 
    })
    .populate("User", "-password") // Explicit projection
    .populate("alamat");

    if (!profile) {
      console.error("Profile not found");
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    // Use explicit projection
    const profiles = await Profile.find({}, { _id: 1, nama: 1 });

    if (!profiles.length) {
      return res.status(404).json({ success: false, message: "No profiles found" });
    }

    return res.status(200).json({
      success: true,
      profiles: profiles.map(profile => ({ _id: profile._id, nama: profile.nama }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { nama, nomorhp, jeniskelamin } = req.body;
    // Sanitize inputs
    const sanitizedData = {
      nama: sanitizeInput(nama),
      nomorhp: sanitizeInput(nomorhp),
      jeniskelamin: sanitizeInput(jeniskelamin)
    };
    
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!nama || !nomorhp || !jeniskelamin) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, and gender are required fields",
      });
    }

    const newProfile = new Profile({
      User: userId, // Use the ID from token
      ...sanitizedData
    });

    await newProfile.save();
    return res.status(201).json({ success: true, profile: newProfile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Error creating profile" 
    });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }

  // Sanitize all input fields
  const sanitizedData = {};
  for (let [key, value] of Object.entries(updateData)) {
    sanitizedData[key] = sanitizeInput(value);
  }

  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: sanitizedData },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    
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
    const deletedProfile = await Profile.findOneAndDelete({ _id: { $eq: id } });
    
    if (!deletedProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    
    return res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
