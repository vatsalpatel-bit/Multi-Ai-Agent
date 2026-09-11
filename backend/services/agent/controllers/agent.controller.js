import { graph } from "../graph/graph.js";
import axios from "axios";

export const agentApi = async (req, res) => {
    try {
        const { conversationId, prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];
        const chatServiceHeaders = {
            "x-user-id": userId,
            "x-user-type": userType
        };

        let currentConversationId = conversationId;

        if (!currentConversationId) {
            const conversationRes = await axios.post(
                `${process.env.CHAT_SERVICE_URL}/api/v1/chat/c`,
                {},
                {
                    headers: chatServiceHeaders
                }
            );

            currentConversationId = conversationRes.data._id;

        }

        // Save user message
        await axios.post(
            `${process.env.CHAT_SERVICE_URL}/api/v1/chat/m`,
            {
                conversationId: currentConversationId,
                role: "user",
                content: prompt.trim()
            },
            { headers: chatServiceHeaders }
        );

        // Generate AI response
        const result = await graph.invoke({
            conversationId: currentConversationId,
            prompt: prompt.trim()
        });

        const response = result.aiResponse;

        // Save assistant message
        await axios.post(
            `${process.env.CHAT_SERVICE_URL}/api/v1/chat/m`,
            {
                conversationId: currentConversationId,
                role: "assistant",
                content: response
            },
            { headers: chatServiceHeaders }
        );

        return res.status(200).json({
            success: true,
            conversationId: currentConversationId,
            response
        });

    } catch (error) {
        console.error(
            "AGENT API ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
