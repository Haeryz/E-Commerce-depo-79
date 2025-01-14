import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    harga_jual: {
        type: Number,
        required: true,
    },
    harga_beli: {
        type: Number,
        required: true,
    },
    stok: {
        type: Number,
        default: 0,
        required: true,
    },
    diskon: {
        type: Number,
        required: true,
        min: [0, 'Discount must be at least 0'], 
        max: [100, 'Discount cannot exceed 100'], 
    },
    berat:{
        value :{
            type: Number,
            required: true,
            min: [0, 'Weight must be at least 0'],
        },
        unit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Berat',
            required: true
        },
    },
    letak_rak: {
        type: String,
        required: false,
    },
    keterangan: {
        type: String,
        required: false,
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori',
        required: true
    },
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true }); 

const Product = mongoose.model("Product", productSchema);

export default Product;
