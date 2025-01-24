import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Image compression middleware
export const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const compressed = await sharp(req.file.buffer)
      .resize({ width: 1200, height: 1200, fit: "inside" }) // Resize if larger
      .jpeg({ quality: 80, progressive: true }) // Convert to progressive JPEG
      .withMetadata() // Keep image metadata
      .toBuffer();

    req.file.buffer = compressed;
    next();
  } catch (error) {
    next(error);
  }
};

export default upload;
