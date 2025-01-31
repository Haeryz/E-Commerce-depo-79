import mongoose from "mongoose";

const strukSchema = mongoose.Schema({
    struk: {
        type: String,
        required: true
    },
    nama_kasir: {
        type: String,
        required: true
    },
    checkout_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkout",
        required: true
    },
    }, {
    timestamps: true
    });

const Struk = mongoose.model("Struk", strukSchema);
export default Struk;