import { getAgent } from "../config/llmModels.js";

/**
 * Handles programming-related prompts selected by the graph router.
 *
 * Every graph endpoint must return an `aiResponse`; otherwise the controller
 * attempts to persist `undefined` as a message and the chat service rejects it.
 */
export const codingAgent = async (state) => {
    const llm = getAgent("coding");
    const response = await llm.invoke([
        {
            role: "system",
            content: `You are guruAI, a helpful programming assistant.

Answer the user's programming question accurately and directly. Explain concepts in plain language. When code helps, provide a small, complete, runnable example in a fenced code block with the correct language. Mention important caveats or best practices, but do not invent requirements or claim to have run code. Use valid Markdown.`,
        },
        {
            role: "human",
            content: state.prompt,
        },
    ]);

    return {
        ...state,
        aiResponse: String(response.content ?? ""),
    };
};
