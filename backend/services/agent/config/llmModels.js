import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
});

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    maxOutputTokens: 2048,
});


const getAgent = async (agent) => {
    switch (agent) {
        case "chat":
            return "groq"
        case "search":
            return "gemini"

        default:
            "groq"
    }
}
