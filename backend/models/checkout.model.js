import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    buktiTransfer: {
        type: String,
        required: false
    },
    nama : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true
    },
    pembayaran: {
        type: String,
        enum : ["Transfer", "COD"],
        required: false
    },
    status: {
        type: String,
        enum : ["Belum Dibayar", "Dibayar", "Dikirim", "Diterima", "Selesai"],
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