import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who placed the order
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the purchased product
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

const Review = mongoose.model("Review", reviewSchema);
export default Review;
