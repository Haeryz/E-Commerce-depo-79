import { ChatMessage } from "../models/chat.model.js";

export const getChatHistory = async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await ChatMessage.find({ room })
            .sort({ timestamp: 1 })
            .limit(100);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await ChatMessage.distinct('room');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
