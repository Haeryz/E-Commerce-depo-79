import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/products.model.js";

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
  const { user, product, rating, comment, image } = req.body;

  if (!user || !product || !rating || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newReview = new Review({ user, product, rating, comment, image });
    const savedReview = await newReview.save();

    // Update product's reviews array using $addToSet to avoid duplicates
    await Product.findByIdAndUpdate(
      product,
      { 
        $addToSet: { reviews: savedReview._id } 
      },
      { new: true, runValidators: true }
    );

    // Get the updated review with populated fields
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'name email')
      .populate('product', 'nama');

    return res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    console.error("Error:", error);
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
