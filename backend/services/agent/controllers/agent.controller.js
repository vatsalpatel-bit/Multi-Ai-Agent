import { graph } from "../graph/graph.js";
import axios from "axios";

export const agentApi = async (req, res) => {
    try {

        const { conversationId, prompt } = req.body;

        let currentConversationId = conversationId;

        req.headers["x-user-id"];
        req.headers["x-user-type"];

        if (!currentConversationId) {
            const conversationRes = await axios.post(
                `${process.env.CHAT_SERVICE_URL}/api/v1/chat/c`,
                {
                    headers: {
                        "x-user-id": req.headers["x-user-id"],
                        "x-user-type": req.headers["x-user-type"]

                    }
                }
            );
            currentConversationId =
                conversationRes.data._id;
        }


        await axios.post(`${process.env.CHAT_SERVICE_URL}/api/v1/chat/m`, {
            conversationId: currentConversationId,
            role: "user",
            content: prompt,
        }, {
            headers: {
                "x-user-id": req.headers["x-user-id"],
                "x-user-type": req.headers["x-user-type"]
            }
        });

        const result = await graph.invoke({
            conversationId: currentConversationId,
            prompt
        });

        const response = result.aiResponse;

        await axios.post(`${process.env.CHAT_SERVICE_URL}/api/v1/chat/m`, {
            conversationId: currentConversationId,
            role: "assistant",
            content: response,
        }, {
            headers: {
                "x-user-id": req.headers["x-user-id"],
                "x-user-type": req.headers["x-user-type"]
            }
        });
        return res.status(200).json({
            conversationId: currentConversationId,
            response,
        });

    } catch (error) {
        console.error("AGENT API ERROR");
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}