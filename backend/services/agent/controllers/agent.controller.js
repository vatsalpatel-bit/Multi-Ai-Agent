import graph from "../graph/graph.js";

export const agentApi = async (req, res) => {
    try {
        const { conversationId, prompt } = req.body;
        await axios.post(`${process.env.CHAT_SERVICE_URL}/m`, {
            conversationId, role: "user", content: prompt
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