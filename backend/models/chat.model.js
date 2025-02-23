import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true,
        default: 'Unknown'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        expires: 60 * 60 * 24 * 21 // 21 days (3 weeks) in seconds
    },
    file: {
        name: String,
        type: String,
        size: Number,
        url: String
    }
}, {
    timestamps: true, // Add createdAt and updatedAt
    collection: 'chat_messages' // Explicitly set collection name
});

// Add TTL index
chatMessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 21 });

// Add some logging to track model usage
chatMessageSchema.pre('save', function(next) {
    console.log('Saving chat message:', this);
    next();
});

// Ensure model isn't already registered
export const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
