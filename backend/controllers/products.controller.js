import mongoose from "mongoose";
import Product from "../models/products.model.js";
import Review from "../models/review.model.js";  // Add this import

export const getProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find()
      .skip(skip) // Skip the records based on the current page
      .limit(Number(limit)); // Limit the number of records per page

    const totalProducts = await Product.countDocuments(); // Total count of products for pagination info

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page: Number(page),
        totalPages: Math.ceil(totalProducts / limit),
        limit: Number(limit),
      },
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
    // Get reviews for this product
    const reviews = await Review.find({ product: id })
      .populate('user', 'name email');

    // Get product and manually set the reviews
    const product = await Product.findById(id).lean();
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Assign the reviews to the product
    product.reviews = reviews;

    return res.status(200).json({ 
      success: true, 
      product
    });
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
    terjual,  // Added terjual field
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const updatedProduct = {
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
    terjual,  // Added terjual field
    _id: id,
  };

  try {
    await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  try {
    await Product.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
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
