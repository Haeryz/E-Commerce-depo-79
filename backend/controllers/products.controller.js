import mongoose from "mongoose";
import Product from "../models/products.model.js";
import Review from "../models/review.model.js";  // Add this import
import { isValidProductData } from '../utils/validators.js';

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get total count first
    const totalProducts = await Product.countDocuments();
    
    // Then get paginated data
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Optional: sort by creation date
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalItems: totalProducts,
        itemsPerPage: limit,
        hasNextPage: skip + limit < totalProducts,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  try {
    // Use $eq operator to prevent injection
    const reviews = await Review.find({ product: { $eq: id } })
      .populate('user', 'name email');

    const product = await Product.findOne({ _id: { $eq: id } }).lean();
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.reviews = reviews;
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    nama,
    harga_jual,
    harga_beli,
    stok,
    diskon,
    berat,
    letak_rak,
    keterangan,
    kategori,
    image,
    terjual = 0,
  } = req.body;

  try {
    const newProduct = new Product({
      nama,
      harga_jual,
      harga_beli,
      stok,
      diskon,
      berat,
      letak_rak,
      keterangan,
      kategori,
      image,
      terjual,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  try {
    // Deep clone and sanitize update data
    const updateData = JSON.parse(JSON.stringify(req.body));
    
    // Remove any MongoDB operators or special characters
    const sanitizedData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (!key.includes('$') && !key.includes('.') && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Validate data types and constraints
    if (!isValidProductData(sanitizedData)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product data" 
      });
    }

    // Use findById first to ensure document exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update only if document exists and data is valid
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: sanitizedData },
      { 
        new: true, 
        runValidators: true,
        sanitizeFilter: true // Enable MongoDB 5.0+ sanitization
      }
    );

    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  try {
    // Use $eq operator for safe deletion
    const result = await Product.findOneAndDelete({ _id: { $eq: id } });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (!q.trim()) {
      return res.status(200).json({ success: true, products: [] });
    }

    const searchResults = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: q,
            path: {
              wildcard: "*"  // Search across all indexed fields
            },
            fuzzy: {
              maxEdits: 2
            }
          }
        }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          nama: 1,
          harga_jual: 1,
          image: 1,
          keterangan: 1,
          score: { $meta: "searchScore" }
        }
      },
      {
        $sort: { score: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      products: searchResults
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error performing search",
      error: error.message
    });
  }
};
