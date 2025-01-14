import mongoose from "mongoose";

const pesananSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who placed the order
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // Reference to the purchased product
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1']
            },
            price: {
                type: Number,
                required: true // Store the price at the time of the order
            },
        }
    ],
    status: {
        type: String,
        enum: [
            'pesanan diterima',
            'pesanan dikirim',
            'pesanan selesai',
            'pesanan diproses',
            'pesanan dibatalkan',
            'barang sedang dicek'
        ],
        default: 'pesanan diproses'
    },
    alamat_pengiriman: {
        type: String,
        required: true
    },
    status_pembayaran: {
        type: String,
        enum: ['belum dibayar', 'sudah dibayar', 'pending'],
        default: 'belum dibayar'
    },
    total: {
        type: Number,
        required: true,
        default: 0 // Calculate total dynamically before saving
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['cash', 'credit card', 'bank transfer', 'e-wallet'],
            required: true
        },
        transactionId: {
            type: String,
            required: false // For tracking payment transactions
        }
    }
}, { timestamps: true });

// Middleware to calculate the total amount before saving
pesananSchema.pre('save', function(next) {
    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
});

const Pesanan = mongoose.model("Pesanan", pesananSchema);

export default Pesanan;
