import mongoose from "mongoose";
import Review from "../models/review.model.js";

export const getReviews = async (req, res) => {
  try {
    const query = req.params.id ? { _id: req.params.id } : {};
    
    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('checkout')
      .populate('productReviews.product', 'nama');

    if (req.params.id && !reviews.length) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    return res.status(200).json({
      success: true,
      reviews: req.params.id ? reviews[0] : reviews
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  const { user, checkout, productReviews } = req.body;

  if (!user || !checkout || !productReviews || !productReviews.length) {
    return res.status(400).json({ 
      success: false, 
      message: "User, checkout and at least one product review are required" 
    });
  }

  try {
    // Check if review already exists for this checkout
    const existingReview = await Review.findOne({ user, checkout });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already exists for this checkout"
      });
    }

    // Validate all products exist in the checkout
    const checkoutDoc = await mongoose.model('Checkout').findById(checkout);
    if (!checkoutDoc) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    // Create map of checkout items for validation
    const checkoutItems = new Set(checkoutDoc.items.map(item => item.product.toString()));
    
    // Validate all products being reviewed were in the checkout
    for (const review of productReviews) {
      if (!checkoutItems.has(review.product.toString())) {
        return res.status(400).json({
          success: false,
          message: `Product ${review.product} was not in this checkout`
        });
      }
    }

    const newReview = new Review({
      user,
      checkout,
      productReviews
    });

    const savedReview = await newReview.save();

    // Update each product's reviews array
    await Promise.all(productReviews.map(review => 
      mongoose.model('Product').findByIdAndUpdate(
        review.product,
        { $addToSet: { reviews: savedReview._id } },
        { new: true, runValidators: true }
      )
    ));

    // Get fully populated review
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'name email')
      .populate('checkout')
      .populate('productReviews.product', 'nama');

    return res.status(201).json({
      success: true,
      review: populatedReview
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
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

export const getReviewsByCheckout = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    // Validate checkout ID
    if (!mongoose.Types.ObjectId.isValid(checkoutId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid checkout ID format"
      });
    }

    // Find reviews for the given checkout ID
    const reviews = await Review.find({ checkout: checkoutId })
      .populate('user', 'name email')
      .populate('checkout')
      .populate('productReviews.product', 'nama');

    return res.status(200).json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false, 
      message: error.message
    });
  }
};
