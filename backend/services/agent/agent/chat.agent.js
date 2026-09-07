import { getAgent } from "../config/llmModels.js"

export const chatAgent = async (state) => {
    const llm = getAgent("chat");
    const systemPrompt = "You are guruAI.an intelligent AI assistant."
    const response = await llm.invoke([
        {
            role: "system",
            content: systemPrompt,
        },
        {
            role: "human",
            content: state.prompt
        }
    ]);
    return {
        ...state,
        aiResponse: response.content
    }
}

