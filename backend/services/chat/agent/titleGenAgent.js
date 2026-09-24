import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
});

export const genTitleAgent = async (message) => {
    const genTitle = await llm.invoke([
        {
            role: "system",
            content: `
Generate a short title for the user's conversation.

Rules:
- Maximum 6 words
- No quotes
- No explanation
- Return only the title
`
        },
        {
            role: "human",
            content: message
        }
    ]);
    return genTitle.content.trim();
}