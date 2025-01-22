import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    buktiTransfer: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Chekcout = mongoose.model("Checkout", checkoutSchema);
export default Chekcout;