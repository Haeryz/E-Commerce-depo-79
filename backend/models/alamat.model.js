import mongoose from "mongoose";

const alamatschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Alamat = mongoose.model("Alamat", alamatschema);
export default Alamat