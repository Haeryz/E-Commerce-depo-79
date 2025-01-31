import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    buktiTransfer: {
        type: String,
        required: false
    },
    nama: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    nama_lengkap: {
        type: String,
        required: false
    },
    Email: {
        type: String,
        required: false,
        validate: {
            validator: (v) => /\S+@\S+\.\S+/.test(v),
            message: (props) => `${props.value} is not a valid email.`
        }
    },
    nomor_telefon: {
        type: String,
        required: false,
        validate: {
            validator: (v) => v.length === 12,
            message: "Must be exactly 12 characters."
        }
    },
    pembayaran: {
        type: String,
        enum: ["Transfer", "COD", "Pending"],  // Add "Pending" as valid enum value
        default: "Pending",  // Set default value
        required: true
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Menunggu Konfirmasi",
            "Dibayar",
            "Ditolak",
            "Belum Dibayar",
            "Dikirim",
            "Diterima",
            "Selesai"
        ],
        required: true
    },
    grandTotal: {
        type: Number,
        required: true,
        ref: "Cart.total"
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
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

const Checkout = mongoose.model("Checkout", checkoutSchema);  // Fixed typo
export default Checkout;