import mongoose from "mongoose";

const beratSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
}, { timestamps: true }); 

const Berat = mongoose.model("Berat", beratSchema);
export default Berat