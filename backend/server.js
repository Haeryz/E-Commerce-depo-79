import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Beratroutes from "./routes/berat.route.js";
import Kategoriroutes from "./routes/kategori.route.js";
import Productroutes from "./routes/product.route.js";
import authroutes from "./routes/auth.route.js";
import protectedRoutes from "./routes/protected.route.js";
import reviewRoutes from "./routes/review.route.js";
import alamatRoutes from "./routes/alamat.route.js";
import profileRoutes from "./routes/profile.route.js";
import cartRoutes from "./routes/cart.route.js";
import cors from 'cors';

dotenv.config();

const app = express();

// Add cors middleware if needed
app.use(cors());
app.use(express.json());

//routes
app.use("/api/Berat", Beratroutes);
app.use("/api/kategori", Kategoriroutes);
app.use("/api/product", Productroutes);
app.use("/api/auth", authroutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/alamat", alamatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cart", cartRoutes);

app.get("/depo79DB", (req, res) => {    
    res.send("Hello World!");
});

// Add global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something broke!',
    error: err.message 
  });
});

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000");
})