import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
});

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
    productReviews: [productReviewSchema]
}, { timestamps: true });

// Add compound index to prevent multiple reviews for same checkout
reviewSchema.index({ user: 1, checkout: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
