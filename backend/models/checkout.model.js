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
            "Ditolak",
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
            ref: "Product",  // Verify this matches your Product model name
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
    }],
    struk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Struk'
    }
}, { timestamps: true });

// Add pre-save middleware to validate product references
checkoutSchema.pre('save', async function(next) {
  const Product = mongoose.model('Product');
  
  // Verify all product references exist
  for (const item of this.items) {
    if (!item.product) {
      throw new Error('Product reference is required for checkout items');
    }
    
    const productExists = await Product.exists({ _id: item.product });
    if (!productExists) {
      throw new Error(`Product with ID ${item.product} does not exist`);
    }
  }
  
  next();
});

// Add these middleware hooks for population
checkoutSchema.pre(['find', 'findOne'], function(next) {
    this.populate({
        path: 'items.product',
        select: 'nama harga_jual'
    });
    next();
});

const Checkout = mongoose.model("Checkout", checkoutSchema);  // Fixed typo
export default Checkout;