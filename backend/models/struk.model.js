import mongoose from "mongoose";

const strukSchema = mongoose.Schema({
    nomor_struk: {
        type: String,
        required: true,
        unique: true
    },
    checkout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkout",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: Number,
        price: Number,
        subtotal: Number
    }],
    total: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    nama_kasir: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Struk = mongoose.model("Struk", strukSchema);
export default Struk;