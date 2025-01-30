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
        enum: [
            "Pending",           // Initial state for Transfer
            "Menunggu Konfirmasi", // After bukti transfer uploaded
            "Dibayar",          // After admin confirms payment
            "Ditolak",          // If payment proof is rejected
            "Belum Dibayar",    // For COD
            "Dikirim",
            "Diterima",
            "Selesai"
        ],
        required: true
    },
    grandTotal: {
        type: Number,
        required: true,
        ref: "Cart.total"  // Reference to cart's total
    },
    alamat_lengkap: {
        type: String,
        required: true
    },
    provinsi: {
        type: String,
        required: true
    },
    kota: {
        type: String,
        required: true
    },
    kecamatan: {
        type: String,
        required: true
    },
    kelurahan: {
        type: String,
        required: true
    },
    kodepos: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Checkout = mongoose.model("Checkout", checkoutSchema);  // Fixed typo
export default Checkout;