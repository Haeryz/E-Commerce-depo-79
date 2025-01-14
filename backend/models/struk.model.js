import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true // Ensure each invoice has a unique identifier
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pesanan", // Link the invoice to its corresponding order
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Link to the user being billed
        required: true
    },
    billingAddress: {
        type: String,
        required: true // Optionally, you can link to an address model
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
                required: true
            },
            price: {
                type: Number,
                required: true // Store the price at the time of billing
            },
            total: {
                type: Number,
                required: true // Calculated as quantity * price
            }
        }
    ],
    subtotal: {
        type: Number,
        required: true // Sum of all item totals
    },
    tax: {
        type: Number,
        required: true,
        default: 0 // Optionally include tax percentage
    },
    total: {
        type: Number,
        required: true // subtotal + tax
    },
    status: {
        type: String,
        enum: ['unpaid', 'paid', 'overdue'],
        default: 'unpaid'
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['cash', 'credit card', 'bank transfer', 'e-wallet'],
            required: true
        },
        transactionId: {
            type: String,
            required: false // Optional for payment tracking
        },
        paymentDate: {
            type: Date
        }
    },
    issuedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

// Middleware to calculate totals
invoiceSchema.pre('save', function (next) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.total = this.subtotal + this.tax;
    next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
