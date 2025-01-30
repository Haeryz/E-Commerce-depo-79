import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    buktiTransfer: {
        type: String,
        required: true
    },
    nama : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true
    },
    pembayaran: {
        type: String,
        enum : ["Transfer", "COD"],
        required: true
    },
    status: {
        type: String,
        enum : ["Belum Dibayar", "Dibayar", "Dikirim", "Diterima"],
        required: true
    },
    grandTotal: {
        type: Number,
        required: true,
        ref: "Cart.total"  // Reference to cart's total
    },
}, { timestamps: true });

const Checkout = mongoose.model("Checkout", checkoutSchema);  // Fixed typo
export default Checkout;