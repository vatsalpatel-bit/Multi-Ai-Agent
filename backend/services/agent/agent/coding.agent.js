import { getAgent } from "../config/llmModels.js";

/**
 * Handles programming-related prompts selected by the graph router.
 *
 * Every graph endpoint must return an `aiResponse`; otherwise the controller
 * attempts to persist `undefined` as a message and the chat service rejects it.
 */
export const codingAgent = async (state) => {
    console.log("Req reach")
};
