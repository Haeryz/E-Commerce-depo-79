import mongoose from "mongoose";
import Review from "../models/review.model.js";
import { uploadImage } from "../services/cloudinary.service.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})  // Using empty object instead of undefined
      .populate({
        path: 'user',
        select: 'nama nomorhp',  // Include any profile fields you want
        model: 'Profile'  // Explicitly specify Profile model
      })
      .populate({
        path: 'product',
        select: 'nama',
        model: 'Product'  // Explicitly specify Product model
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews: reviews.map(review => ({
        ...review.toObject(),
        userName: review.user?.nama || 'Anonymous',
        productName: review.product?.nama || 'Unknown Product'
      }))
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  const { user, checkout, product, rating, comment } = req.body;

  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(user) ||
        !mongoose.Types.ObjectId.isValid(checkout) ||
        !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    // Validate rating is a number between 1 and 5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5"
      });
    }

    // Sanitize comment
    const sanitizedComment = comment.trim();
    if (!sanitizedComment || sanitizedComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be between 1 and 1000 characters"
      });
    }

    // Log the review attempt
    console.log(`Review attempt - User: ${user}, Checkout: ${checkout}, Product: ${product}`);

    // Validate required fields
    if (!user || !checkout || !product || !rating || !comment) {
      console.log('Missing fields:', { user, checkout, product, rating, comment });
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Get checkout and populate products
    const checkoutDoc = await mongoose.model('Checkout')
      .findById(checkout)
      .populate('items.product');

    if (!checkoutDoc) {
      console.log(`Checkout not found: ${checkout}`);
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    // Debug log the checkout items
    console.log('Checkout items:', checkoutDoc.items.map(item => ({
      productId: item.product._id.toString(),
      name: item.product.nama
    })));

    // Find the specific product in checkout items using proper ObjectId comparison
    const purchasedItem = checkoutDoc.items.find(item => 
      item.product._id.toString() === product
    );

    console.log('Found purchased item:', purchasedItem ? {
      productId: purchasedItem.product._id.toString(),
      name: purchasedItem.product.nama,
      quantity: purchasedItem.quantity,
      price: purchasedItem.price
    } : 'Not found');

    if (!purchasedItem) {
      return res.status(400).json({
        success: false,
        message: "You can only review products you have purchased in this order"
      });
    }

    // Log the purchased item details
    console.log('Found purchased item:', {
      product: purchasedItem.product,
      quantity: purchasedItem.quantity,
      price: purchasedItem.price
    });

    // Use $eq operator for safe comparison
    const existingReview = await Review.findOne({
      $and: [
        { user: { $eq: user } },
        { checkout: { $eq: checkout } },
        { product: { $eq: product } }
      ]
    });

    if (existingReview) {
      console.log(`Duplicate review attempt - User: ${user}, Product: ${product}`);
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product for this checkout"
      });
    }

    // Handle image upload if present
    let imageUrl = null;
    if (req.file) {
      console.log('Processing image upload');
      const fileStr = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;
      const uploadResult = await uploadImage(fileUri, {
        folder: 'review-images',
      });
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
        console.log('Image uploaded successfully');
      } else {
        console.log('Image upload failed');
      }
    }

    // Create new review
    const newReview = new Review({
      user,
      checkout,
      product,
      rating,
      comment: sanitizedComment,
      image: imageUrl
    });

    const savedReview = await newReview.save();
    console.log(`Review created successfully - ID: ${savedReview._id}`);

    // Add review reference to product
    await mongoose.model('Product').findByIdAndUpdate(
      product,
      { $addToSet: { reviews: savedReview._id } }
    );

    // Return populated review with explicit product model
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'name email')
      .populate({
        path: 'product',
        model: 'Product',
        select: 'nama harga_jual'
      })
      .populate({
        path: 'checkout',
        populate: {
          path: 'items.product',
          model: 'Product',
          select: 'nama harga_jual'
        }
      });

    return res.status(201).json({
      success: true,
      review: populatedReview
    });

  } catch (error) {
    console.error("Review creation error:", {
      error: error.message,
      user,
      checkout,
      product
    });
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
    return res.status(404).json({ 
      success: false, 
      message: "Invalid review ID" 
    });
  }

  // Validate rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number between 1 and 5"
    });
  }

  // Sanitize comment
  const sanitizedComment = comment.trim();
  if (!sanitizedComment || sanitizedComment.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Comment must be between 1 and 1000 characters"
    });
  }

  const updatedReview = { rating, comment, _id: id };

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: { $eq: id } },
      { 
        $set: { 
          rating: rating,
          comment: sanitizedComment
        } 
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    return res.status(200).json({ 
      success: true, 
      review: updatedReview 
    });
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
      .populate({
        path: 'product',
        model: 'Product',
        select: 'nama harga_jual'
      })
      .populate('checkout');

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

export const getCheckoutReviews = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    
    const reviews = await Review.find({ checkout: checkoutId })
      .populate('user', 'name email')
      .populate({
        path: 'product',
        model: 'Product',
        select: 'nama harga_jual'
      })
      .populate('checkout');

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

// Add new function to get unreviewed products from a checkout
export const getUnreviewedProducts = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { userId } = req.query;

    console.log('Starting unreviewed products fetch:', { checkoutId, userId });

    if (!checkoutId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Checkout ID and User ID are required"
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(checkoutId) ||
        !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    // First, get the raw checkout document
    const rawCheckout = await mongoose.model('Checkout').findById(checkoutId);
    console.log('Raw checkout items before population:', 
      JSON.stringify(rawCheckout?.items, null, 2)
    );

    // Get the checkout with explicit population
    const checkout = await mongoose.model('Checkout').findOne({
      _id: { $eq: checkoutId }
    }).populate({
      path: 'items.product',
      model: 'Product'
    });

    if (!checkout) {
      console.log('Checkout not found:', checkoutId);
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    // Verify item product references
    const validItems = checkout.items.filter(item => {
      const isValid = item && item.product && mongoose.Types.ObjectId.isValid(item.product._id);
      if (!isValid) {
        console.log('Invalid item:', item);
        console.log('Product reference:', item.product);
      }
      return isValid;
    });

    console.log('Valid items found:', validItems.length);

    // Use $and and $eq for safe comparison
    const existingReviews = await Review.find({
      $and: [
        { checkout: { $eq: checkoutId } },
        { user: { $eq: userId } }
      ]
    });

    console.log('Existing reviews:', existingReviews.length);

    const reviewedProductIds = new Set(
      existingReviews.map(review => review.product.toString())
    );

    // Map only valid items that haven't been reviewed
    const unreviewedProducts = validItems
      .filter(item => !reviewedProductIds.has(item.product._id.toString()))
      .map(item => ({
        product: {
          _id: item.product._id,
          nama: item.product.nama,
          harga_jual: item.product.harga_jual
        },
        quantity: item.quantity,
        price: item.price
      }));

    console.log('Final unreviewed products:', unreviewedProducts.length);

    return res.status(200).json({
      success: true,
      checkout: {
        _id: checkout._id,
        status: checkout.status
      },
      unreviewedProducts,
      debug: {
        rawItemCount: rawCheckout?.items?.length || 0,
        validItemCount: validItems.length,
        reviewedCount: existingReviews.length,
        unreviewedCount: unreviewedProducts.length
      }
    });

  } catch (error) {
    console.error("Error in getUnreviewedProducts:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
