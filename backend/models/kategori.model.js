import mongoose from "mongoose";

const kategoriSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
}, { timestamps: true }); 

const Kategori = mongoose.model("Kategori", kategoriSchema);
export default Kategori