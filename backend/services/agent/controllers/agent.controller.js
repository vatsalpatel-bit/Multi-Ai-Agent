import graph from "../graph/graph.js";
import axios from "axios";
import crypto from "crypto"

export const agentApi = async (req, res) => {
    try {
        console.log("Agent start");
        
        const { conversationId, prompt } = req.body;
        let currentConversationId = conversationId;

        const userId = req.headers["x-user-id"];
        const type = req.headers["x-user-type"];

        if (!currentConversationId) {
            currentConversationId = crypto.randomUUID();
        }
        await axios.post(`${process.env.CHAT_SERVICE_URL}/m`, {
            conversationId: currentConversationId,
            role: "user",
            content: prompt,
            userId,
            type,
        });

        const result = await graph.invoke({
            conversationId,
            prompt
        });

        const response = result.aiResponse;

        return res.status(200).json({
            success: true,
            response,
        });

    } catch (error) {
        console.log(`agent api error:${error}`);
        return res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}