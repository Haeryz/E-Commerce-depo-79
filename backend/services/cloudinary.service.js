import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dg1nmmyek',
    api_key: process.env.IMAGE_STORAGE_KEY,
    api_secret: process.env.IMAGE_STORAGE_SECRET
});

// Upload image
export const uploadImage = async (imagePath, options = {}) => {
    try {
        const defaultOptions = {
            folder: 'bukti-transfer',
            transformation: [
                { quality: "auto:good" },
                { fetch_format: "auto" },
                { flags: "progressive" }
            ],
            ...options
        };

        const result = await cloudinary.uploader.upload(imagePath, defaultOptions);
        return { success: true, url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
};

// Get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
    const defaultOptions = {
        fetch_format: 'auto',
        quality: 'auto',
        ...options
    };
    return cloudinary.url(publicId, defaultOptions);
};

// Delete image
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return { success: true, result };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: error.message };
    }
};
