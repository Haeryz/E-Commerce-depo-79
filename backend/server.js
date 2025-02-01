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
import checkoutRoute from "./routes/checkout.route.js";
import { createServer } from 'http';
import { initSocket } from './socket.js'; // Make sure path is correct
import { uploadImage, getOptimizedImageUrl, deleteImage } from './services/cloudinary.service.js';
import path from "path";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO before routes
const io = initSocket(httpServer);

// Enable CORS with credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

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
app.use("/api/checkout", checkoutRoute);

if(process.env === 'production'){
  app.use(express.static(path.join(__dirname, "/depo79/dist")))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "depo79", "dist", "index.html"));
  })
}

// Add test endpoint for Cloudinary
app.post('/api/upload-image', async (req, res) => {
    const { imagePath } = req.body;
    const result = await uploadImage(imagePath);
    res.json(result);
});

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


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});