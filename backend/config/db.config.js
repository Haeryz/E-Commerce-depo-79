import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Initialize GridFS bucket after successful connection
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return bucket;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export const getBucket = () => bucket;
export default connectDB;
