import mongoose from "mongoose";
import Review from "../models/review.model.js";

export const getReviews = async (req, res) => {
  try {
    if (req.params.id) {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found" });
      }
      return res.status(200).json({ success: true, review });
    } else {
      const reviews = await Review.find();
      return res.status(200).json({ success: true, reviews });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  if (!productId || !userId || !rating || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const newReview = new Review({ productId, userId, rating, comment });

  try {
    await newReview.save();
    return res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  }

  const updatedReview = { rating, comment, _id: id };

  try {
    await Review.findByIdAndUpdate(id, updatedReview, { new: true });
    return res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  }

  try {
    await Review.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
