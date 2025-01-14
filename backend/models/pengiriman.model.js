import mongoose from "mongoose";

const PengirimanSchema = new mongoose.Schema({
    PengirimanNumber: {
        type: String,
        required: true,
        unique: true // Ensure each Pengiriman entry has a unique identifier
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pesanan", // Link the Pengiriman to its corresponding order
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Link to the customer who placed the order
        required: true
    },
    address: {
        type: String,
        required: true // The delivery address
    },
    PengirimanMethod: {
        type: String,
        enum: ['standard', 'express', 'same-day', 'pickup'], // Add methods relevant to your business
        required: true
    },
    trackingNumber: {
        type: String,
        required: false // Optional: tracking number provided by a Pengiriman carrier
    },
    carrier: {
        type: String,
        required: false // Name of the Pengiriman company (e.g., DHL, FedEx, etc.)
    },
    PengirimanCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            'awaiting shipment',
            'in transit',
            'out for delivery',
            'delivered',
            'canceled',
            'returned'
        ],
        default: 'awaiting shipment'
    },
    shippedAt: {
        type: Date,
        required: false // The date and time when the shipment was dispatched
    },
    deliveredAt: {
        type: Date,
        required: false // The date and time when the shipment was delivered
    }
}, { timestamps: true });

const Pengiriman = mongoose.model("Pengiriman", PengirimanSchema);

export default Pengiriman;
