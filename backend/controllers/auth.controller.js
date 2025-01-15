import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";

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
  const secretKey = ""; // Replace with your Turnstile secret key
  const response = await axios.post(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      null,
      {
          params: {
              secret: process.dotenv.CLOUDFLARE_SECRET_KEY,
              response: turnstileToken,
          },
      }
  );

  if (!response.data.success) {
      return res.status(400).json({ error: "Turnstile verification failed" });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({
          token,
          user: { name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
      res.status(500).json({ error: "Error logging in" });
  }
};