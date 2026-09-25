import api from "./axios.js"

export const agentApi = async ({ conversationId, prompt, agent }) => {
    try {
        const res = await api.post("/api/v1/agent/chat", {
            conversationId,
            prompt,
            agent
        });
        return res.data;
    } catch (error) {
        console.log("API agent error:", error);
        throw error;
    }
}

