import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import { generateOtp, verifyOtp, hashOtp } from "../utils/otp.js";
import nodemailer from "nodemailer";

dotenv.config();
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required" 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid email format" 
      });
    }

    // Use $eq operator for safe comparison
    const existingUser = await User.findOne({
      email: { $eq: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: "Email already exists" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    // Save hashed OTP with expiration time
    otpStore.set(email, { hashedOtp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Temporarily save user data (use a database or cache for better management)
    otpStore.set(`user_${email}`, { name, email, password: hashedPassword, role });

    res.status(200).json({ message: "OTP sent to email for verification." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: "Error during registration" 
    });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpEntry = otpStore.get(email);

    if (!otpEntry) {
      return res.status(400).json({ error: "OTP not found or expired." });
    }

    const { hashedOtp, expiresAt } = otpEntry;

    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired." });
    }

    const isOtpValid = await verifyOtp(otp, hashedOtp);

    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Retrieve and save user data
    const userData = otpStore.get(`user_${email}`);
    if (!userData) {
      return res.status(400).json({ error: "User data not found." });
    }

    const { name, password, role } = userData;

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Clean up temporary storage
    otpStore.delete(email);
    otpStore.delete(`user_${email}`);

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error verifying OTP." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, turnstileToken } = req.body;

  // Input validation
  if (!email || !password || !turnstileToken) {
    return res.status(400).json({
      success: false,
      error: "All fields are required"
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format"
    });
  }

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
    // Use $eq operator for safe comparison
    const user = await User.findOne({
      email: { $eq: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({
      success: false,
      error: "Error logging in"
    });
  }
};

export const registerAdmin = async (req, res) => {
  const { nama, email, password } = req.body;  // Changed from 'name' to 'nama'

  try {
    // Input validation
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format"
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Use $eq operator for role count
    const adminCount = await User.countDocuments({
      role: { $eq: 'admin' }
    });

    if (adminCount >= 3) {
      return res.status(403).json({
        success: false,
        message: "Maximum number of admin accounts (3) has been reached"
      });
    }

    // Use $eq operator for existing user check
    const existingUser = await User.findOne({
      email: { $eq: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Sanitize input data
    const sanitizedData = {
      name: nama.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin'
    };

    const newAdmin = new User(sanitizedData);
    await newAdmin.save();

    res.status(201).json({ 
      success: true,
      message: "Admin user created successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Error creating admin user"
    });
  }
};