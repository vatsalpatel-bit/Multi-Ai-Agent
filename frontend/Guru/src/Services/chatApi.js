import api from "./axios.js";

export const getMessageAPi = async (conversationId) => {
    try {
        const res = await api.get(`/api/v1/chat/get/m/${conversationId}`);
        return res.data;
    } catch (error) {
        console.log(`Chat api error`)
        throw error;
    }
}

export const getConversationApi = async () => {
    try {
        const res = await api.get(`/api/v1/chat/get/c`);
        return res.data;
    } catch (error) {
        console.log("Conversation api error")
    }
}
