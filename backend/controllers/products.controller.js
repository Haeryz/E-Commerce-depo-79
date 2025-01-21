import mongoose from "mongoose";
import Product from "../models/products.model.js";

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
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

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
  } = req.body;

  if (
    !nama ||
    !harga_jual ||
    !harga_beli ||
    !stok ||
    !diskon ||
    !berat ||
    !kategori ||
    !image
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

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
  });

  try {
    await newProduct.save();
    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
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
