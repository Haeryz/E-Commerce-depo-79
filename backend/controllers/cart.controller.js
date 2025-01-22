import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";
import Profile from "../models/profile.model.js";

export const getCart = async (req, res) => {
  try {
    // First get the profile associated with the authenticated user
    const profile = await Profile.findOne({ User: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const cart = await Cart.findOne({ user: profile._id })
      .populate("items.product")
      .populate("user", "nama"); // Populate profile name

    if (!cart) {
      const newCart = new Cart({ user: profile._id, items: [] });
      await newCart.save();
      return res.json({ success: true, cart: newCart });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Get profile
    const profile = await Profile.findOne({ User: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: profile._id });
    if (!cart) {
      cart = new Cart({ user: profile._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.total = await calculateTotal(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );
    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get profile
    const profile = await Profile.findOne({ User: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    let cart = await Cart.findOne({ user: profile._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.total = await calculateTotal(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );
    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const calculateTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.harga_jual * item.quantity;
    }
  }
  return total;
};
