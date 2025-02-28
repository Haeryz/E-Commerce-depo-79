import mongoose from "mongoose";
import Checkout from "../models/checkout.model.js";  // Fixed typo
import Cart from "../models/cart.model.js";
import { uploadImage } from "../services/cloudinary.service.js";
import { getIO } from '../services/socket.service.js'; // Updated import path
import Struk from "../models/struk.model.js";

export const getCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid checkout ID format" 
      });
    }

    if (id) {
      const checkout = await Checkout.findOne({ 
        _id: id 
      }).populate('items.product', 'nama harga_jual');
      
      if (!checkout) {
        return res.status(404).json({ 
          success: false, 
          message: "Checkout not found" 
        });
      }
      return res.status(200).json({ success: true, checkout });
    }

    const checkouts = await Checkout.find({})
      .populate('items.product', 'nama harga_jual')
      .sort({ createdAt: -1 })
      .limit(100);  // Add reasonable limit
      
    return res.status(200).json({ success: true, checkouts });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching checkouts' 
    });
  }
};

export const createCheckout = async (req, res) => {
  try {
    const { 
      nama, 
      cartId,
      nama_lengkap,
      Email,
      nomor_telefon,
      alamat_lengkap,
      provinsi,
      kota,
      kecamatan,
      kelurahan,  // This field is empty in your request
      kodepos,
      items,
      total
    } = req.body;

    // Validate ObjectIds
    if (cartId && !mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID format"
      });
    }

    if (nama && !mongoose.Types.ObjectId.isValid(nama)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID format"
      });
    }

    // Log the request body for debugging
    console.log('Received checkout data:', req.body);

    // Validate required fields (removed pembayaran)
    if (!nama || (!cartId && !items) || !alamat_lengkap || 
        !provinsi || !kota || !kecamatan || !kelurahan || !kodepos) {
      console.log('Missing fields:', {
        nama: !!nama,
        cartId: !!cartId,
        items: !!items,
        alamat_lengkap: !!alamat_lengkap,
        provinsi: !!provinsi,
        kota: !!kota,
        kecamatan: !!kecamatan,
        kelurahan: !!kelurahan, // This is false because it's empty
        kodepos: !!kodepos
      });
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Replace vulnerable email validation with a more secure approach
    if (Email) {
      // Basic structural validation
      const parts = Email.split('@');
      if (parts.length !== 2 || !parts[0] || !parts[1] || 
          !parts[1].includes('.') || parts[1].startsWith('.') || 
          parts[1].endsWith('.') || Email.length > 254) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }
    }

    // Validate phone number if provided
    if (nomor_telefon && nomor_telefon.length !== 12 ) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 12 characters"
      });
    }

    let checkoutItems = items;

    if (cartId) {
      // Use $eq operator for safe comparison
      const cart = await Cart.findOne({
        _id: { $eq: cartId }
      }).populate('items.product');

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found"
        });
      }

      // Use $eq operator for safe comparison
      const profileExists = await mongoose.model('Profile').findOne({
        _id: { $eq: nama }
      });

      if (!profileExists) {
        return res.status(404).json({
          success: false,
          message: "Profile not found"
        });
      }

      // Transform cart items for checkout
      checkoutItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.harga_jual // assuming this is the price field
      }));

      // Secure cart update using findOneAndUpdate with $eq operator
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: { $eq: cartId } },
        { 
          $set: { 
            items: [],
            total: 0
          }
        },
        { 
          new: true,
          runValidators: true,
          upsert: false // Prevent creation of new documents
        }
      );

      if (!updatedCart) {
        return res.status(404).json({
          success: false,
          message: "Failed to update cart"
        });
      }
    }

    // Create new checkout with pending status and items
    const newCheckout = new Checkout({
      buktiTransfer: "",
      nama,
      nama_lengkap: nama_lengkap || "",
      Email: Email || "",
      nomor_telefon: nomor_telefon || "",
      pembayaran: "Pending",  // Set initial payment method as Pending
      status: "Pending", // All orders start as pending
      grandTotal: total,
      items: checkoutItems, // Add the items here
      alamat_lengkap,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      kodepos
    });

    await newCheckout.save();

    // Populate the items and other necessary fields before emitting
    const populatedCheckout = await Checkout.findById(newCheckout._id)
      .populate('items.product')
      .populate('struk')
      .lean(); // Use lean() for better performance

    // Get IO instance and emit
    const io = getIO();
    io.emit('newCheckout', populatedCheckout);

    return res.status(201).json({
      success: true,
      checkout: populatedCheckout
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add a new endpoint to upload bukti transfer later
export const uploadBuktiTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { pembayaran } = req.body;

    if (!pembayaran || !['Transfer', 'COD'].includes(pembayaran)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Must be either 'Transfer' or 'COD'"
      });
    }

    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found"
      });
    }

    // Prevent changing payment method if already set
    if (checkout.pembayaran !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Payment method already set and cannot be changed"
      });
    }

    checkout.pembayaran = pembayaran;

    // If Transfer, require and process bukti transfer
    if (pembayaran === "Transfer") {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Bukti Transfer image is required for transfer payment"
        });
      }

      const fileStr = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;

      const uploadResult = await uploadImage(fileUri, {
        folder: 'bukti-transfer',
      });

      if (!uploadResult.success) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image"
        });
      }

      checkout.buktiTransfer = uploadResult.url;
      checkout.status = "Menunggu Konfirmasi";
    } else {
      // For COD
      checkout.buktiTransfer = "";
      checkout.status = "Belum Dibayar";
    }

    await checkout.save();
    
    // Populate the checkout before emitting
    const populatedCheckout = await Checkout.findById(checkout._id)
      .populate('items.product', 'nama harga_jual');
    
    // Emit the updated checkout
    getIO().emit('checkoutUpdated', populatedCheckout);

    return res.status(200).json({
      success: true,
      checkout: populatedCheckout
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const updateCheckout = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let newStruk = null; // Declare newStruk outside the if block

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Checkout not found" });
  }

  try {
    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({ success: false, message: "Checkout not found" });
    }

    // Validate status transition
    if (status) {
      // Handle transitions from "Menunggu Konfirmasi"
      if (checkout.status === "Menunggu Konfirmasi") {
        if (!["Dikirim", "Ditolak"].includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid status transition from Menunggu Konfirmasi"
          });
        }
      } 
      // Handle transition from "Dikirim" to "Selesai"
      else if (checkout.status === "Dikirim") {
        if (status !== "Selesai") {
          return res.status(400).json({
            success: false,
            message: "Can only transition to Selesai from Dikirim status"
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid status transition"
        });
      }
      
      // If the order is being marked as completed (Selesai), generate a struk
      if (status === "Selesai") {
        const strukNumber = `STR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        newStruk = new Struk({
            nomor_struk: strukNumber,
            checkout: checkout._id,
            items: checkout.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price
            })),
            total: checkout.grandTotal,
            payment_method: checkout.pembayaran,
            nama_kasir: 'Fuad', // Changed to hardcoded value 'Fuad'
            customer_name: checkout.nama_lengkap
        });

        await newStruk.save();
        
        // Add struk reference to checkout
        checkout.struk = newStruk._id;
      }

      checkout.status = status;
    }

    await checkout.save();
    
    // Populate all necessary fields before emitting
    const updatedCheckout = await Checkout.findById(id)
      .populate('items.product')
      .populate('struk')
      .lean(); // Use lean() for better performance
      
    // Get IO instance and emit
    const io = getIO();
    io.emit('checkoutUpdated', updatedCheckout);
    
    return res.status(200).json({ 
      success: true, 
      checkout: updatedCheckout,
      struk: newStruk // Now newStruk will be null if not created
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCheckout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Checkout not found" });
  }

  try {
    await Checkout.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Checkout deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCheckoutsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID format"
      });
    }

    // Use $eq operator for safe comparison
    const checkouts = await Checkout.find({ 
      nama: { $eq: profileId } 
    }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      checkouts 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const searchCheckouts = async (req, res) => {
  try {
    const {
      query,
      status,
      payment,
      startDate,
      endDate,
      minTotal,
      maxTotal
    } = req.query;

    // Build match stage with $eq operators
    const matchStage = {};

    // Validate and sanitize status
    if (status && ['Pending', 'Menunggu Konfirmasi', 'Dikirim', 'Selesai', 'Ditolak'].includes(status)) {
      matchStage.status = { $eq: status };
    }

    // Validate and sanitize payment
    if (payment && ['Transfer', 'COD', 'Pending'].includes(payment)) {
      matchStage.pembayaran = { $eq: payment };
    }

    // Validate and sanitize dates
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate && !isNaN(new Date(startDate))) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate && !isNaN(new Date(endDate))) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Validate and sanitize totals
    if (minTotal !== undefined || maxTotal !== undefined) {
      matchStage.grandTotal = {};
      const parsedMinTotal = parseFloat(minTotal);
      const parsedMaxTotal = parseFloat(maxTotal);
      
      if (!isNaN(parsedMinTotal)) {
        matchStage.grandTotal.$gte = parsedMinTotal;
      }
      if (!isNaN(parsedMaxTotal)) {
        matchStage.grandTotal.$lte = parsedMaxTotal;
      }
    }

    // Text search pipeline with sanitized input
    const pipeline = [];
    
    if (query && typeof query === 'string') {
      const sanitizedQuery = query.replace(/[^a-zA-Z0-9@. -]/g, '');
      pipeline.push({
        $search: {
          text: {
            query: sanitizedQuery,
            path: ["nama_lengkap", "Email", "alamat_lengkap", "nomor_telefon"]
          }
        }
      });
    }

    // Add match stage if there are any filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $limit: 50 }
    );

    const result = await Checkout.aggregate(pipeline).exec();

    // Safely populate with specific fields
    const populatedResults = await Checkout.populate(result, {
      path: 'items.product',
      select: 'nama harga_jual'
    });

    return res.status(200).json({
      success: true,
      count: result.length,
      checkouts: populatedResults
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while searching checkouts'
    });
  }
};