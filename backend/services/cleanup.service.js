import { ChatMessage } from '../models/chat.model.js';

export const cleanupOldMessages = async () => {
    try {
        const threeWeeksAgo = new Date();
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

        const result = await ChatMessage.deleteMany({
            timestamp: { $lt: threeWeeksAgo }
        });

        console.log(`Cleaned up ${result.deletedCount} old messages`);
        return result;
    } catch (error) {
        console.error('Error during message cleanup:', error);
        throw error;
    }
};

// Optional: Schedule cleanup to run every 3 weeks
export const scheduleCleanup = () => {
    const CLEANUP_INTERVAL = 1000 * 60 * 60 * 24 * 21; // 3 weeks in milliseconds
    
    setInterval(async () => {
        try {
            await cleanupOldMessages();
            console.log('Scheduled cleanup completed successfully');
        } catch (error) {
            console.error('Scheduled cleanup failed:', error);
        }
    }, CLEANUP_INTERVAL);
};
