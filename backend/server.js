import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
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
import { initSocket } from './services/socket.service.js'; // Updated path
import { uploadImage } from './services/cloudinary.service.js';
import strukRoute from "./routes/struk.route.js";
import rateLimit from 'express-rate-limit';
import chatRoutes from "./routes/chat.route.js";
import { ChatMessage } from './models/chat.model.js'; // Add this import
import { scheduleCleanup } from './services/cleanup.service.js';
import { URL } from 'url';
import fs from 'fs';

// Add at the top of your file
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:');
  console.error(err.message);
  console.error(err.stack);
});

// Fix directory path resolution for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname); // go up one level to reach project root

// Add this helper function to debug module resolution
const resolveModule = (modulePath) => {
  try {
    const resolvedPath = path.resolve(rootDir, modulePath);
    console.log(`Resolving module: ${modulePath} => ${resolvedPath}`);
    return resolvedPath;
  } catch (err) {
    console.error(`Failed to resolve module: ${modulePath}`, err);
    throw err;
  }
};

dotenv.config();

const app = express();
const httpServer = createServer(app);

// At the beginning of your server startup
console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
console.log('Files in backend directory:', fs.readdirSync('./backend').join(', '));

// Configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500 // increased from 100 to 500 requests per windowMs
});

// Configure stricter rate limiter for static files
const staticLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // increased from 50 to 200 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// Initialize Socket.IO with debug message
console.log('Initializing Socket.IO...');
const io = initSocket(httpServer);
console.log('Socket.IO initialized successfully');

// Enable CORS with credentials
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    /\.azurewebsites\.net$/,  // Allow Azure domains
    /\.loca\.lt$/  // Allow localtunnel domains
  ],
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
app.use("/api/struk", strukRoute);
app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV === 'production'){
  // Apply stricter rate limiting to static file serving
  app.use(staticLimiter);
  
  // Construct absolute paths
  const distPath = path.join(rootDir, 'depo79', 'dist');
  
  // Debug logging
  console.log('Root directory:', rootDir);
  console.log('Dist path:', distPath);
  
  // Serve static files
  app.use(express.static(distPath));
  
  // Serve index.html for all other routes
  app.get("*", staticLimiter, (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  });
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
httpServer.listen(PORT, async () => {
    try {
        await connectDB();
        console.log('MongoDB connected successfully');
        
        // Initialize cleanup service
        scheduleCleanup();
        console.log('Message cleanup service initialized');
        
        try {
            // Test database connection by trying to count chat messages
            const count = await ChatMessage.countDocuments();
            console.log(`Current chat messages in database: ${count}`);
        } catch (countError) {
            console.warn('Could not count chat messages:', countError.message);
        }
        
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Socket.IO is ready for connections');
    } catch (error) {
        console.error('Error during startup:', error);
    }
});