import redis from "../../../shared/redis/redis.js";
import { getUserMessagesApi } from "../utils/getMessagesApi.js";

export const getMemory = async (userId) => {

    const key = `messages-${userId}`;
    const cached = await redis.get(key);
    
    if (cached) {
        return JSON.parse(cached);
    };

    const messages = await getUserMessagesApi(userId);
    
    const recentMessages = messages.slice(-50);
    
    await redis.set(key, JSON.stringify(recentMessages), "EX", 24 * 60 * 60);
    
    return recentMessages;
};

export const addMessage = async ({ conversationId, userId, role, content }) => {
    const key = `messages-${userId}`;
    const rawMessages = await redis.get(key);
    const messages = rawMessages ? JSON.parse(rawMessages) : [];

    messages.push({
        conversationId, role, content
    });

    if (messages.length > 50) {
        messages.shift();
    };

    await redis.set(key, JSON.stringify(messages))
}