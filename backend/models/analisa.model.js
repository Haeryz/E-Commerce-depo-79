import mongoose from "mongoose";

const AnalisaSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum: [
            'product_view', 
            'order_created', 
            'order_completed', 
            'user_registered', 
            'cart_updated',
            'search_performed',
            'product_added_to_cart'
        ],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user triggering the event
        required: false // Not all events may have an associated user
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Optional: For product-related events
        required: false
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pesanan", // Optional: For order-related events
        required: false
    },
    metadata: {
        type: Map,
        of: String, // Flexible field to store additional data (e.g., search terms, filters)
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically track when the event occurred
    }
}, { timestamps: true });

const Analisa = mongoose.model("Analisa", AnalisaSchema);

export default Analisa;
