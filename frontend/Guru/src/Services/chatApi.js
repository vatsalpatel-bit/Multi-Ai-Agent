import api from "./axios.js"

export const agentApi = async (message) => {
    try {
        const res = await api.post("/api/v1/agent/chat", {
            conversationId: message.conversationId,
            prompt: message.prompt,
        });
        return res.data;
    } catch (error) {
        console.log("API agent error:", error);
        throw error;
    }
}