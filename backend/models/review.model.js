import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    checkout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkout",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Changed back to "Product" instead of "Products"
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    comment: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Compound index to prevent multiple reviews for same product in same checkout
reviewSchema.index({ user: 1, checkout: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
