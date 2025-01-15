import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data"; // Add this import at the top of the file

dotenv.config();
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer", // Default to 'customer' if no role is provided
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, turnstileToken } = req.body;

  // Verify the Turnstile token with Cloudflare's API
  const secretKey = process.env.CLOUDFLARE_SECRET_KEY; // Use your secret key from environment variables

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", turnstileToken);

  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData,
      { headers: formData.getHeaders() }
    );

    if (!response.data.success) {
      return res.status(400).json({
        error: "Turnstile verification failed",
        details: response.data["error-codes"],
      });
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return res.status(500).json({ error: "Error verifying Turnstile token" });
  }

  // Proceed with login logic after successful Turnstile verification
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error logging in" });
  }
};