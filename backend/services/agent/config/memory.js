import redis from "../../../shared/redis/redis.js   ";
import { getMessagesApi } from "../utils/getMessagesApi.js";

export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`;
    const cached = await redis.get(key);
    if (cached) {
        return JSON.parse(cached);
    };

    const messages = await getMessagesApi(conversationId);
    const recentMessages = messages.slice(-50);
    await redis.set(key, JSON.stringify(recentMessages), "EX", 24 * 60 * 60``);
    return recentMessages;
};

export const addMessage = async ({ conversationId, role, content }) => {
    const key = `messages-${conversationId}`;
    const rawMessages = await redis.get(key);
    const messages = rawMessages ? JSON.parse(rawMessages) : [];

    messages.push({
        role, content
    });

    if (messages.length > 50) {
        messages.shift();
    };

    await redis.set(key, JSON.stringify(messages))
}