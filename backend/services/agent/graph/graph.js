import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agent/chat.agent.js";
import { searchAgent } from "../agent/search.agent.js";
import { codingAgent } from "../agent/coding.agent.js";
import { pdfGenAgent } from "../agent/pdfGen.agent.js";
import { pptGenAgent } from "../agent/pptGen.agent.js";
import { imageGenAgent } from "../agent/imageGen.agent.js";

const workFlow = new StateGraph(agentState)

workFlow.addNode("router", router)
workFlow.addNode("chat", chatAgent)
workFlow.addNode("search", searchAgent)
workFlow.addNode("coding", codingAgent)
workFlow.addNode("pdf", pdfGenAgent)
workFlow.addNode("ppt", pptGenAgent)
workFlow.addNode("imageGen", imageGenAgent)

workFlow.addEdge("__start__", "router")
workFlow.addConditionalEdges("router", (state) => {
    switch (state.agent) {
        case "chat":
            return "chat";
        case "search":
            return "search";
        case "coding":
            return "coding";
        case "pdf":
            return "pdf"
        case "ppt":
            return "ppt"
        case "imageGen":
            return "imageGen"
        default:
            return "chat"
    }
}, {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    imageGen: "imageGen",

})

workFlow.addEdge("search", "chat")
workFlow.addEdge("chat", "__end__")
workFlow.addEdge("coding", "__end__")
workFlow.addEdge("pdf", "__end__")
workFlow.addEdge("ppt", "__end__")
workFlow.addEdge("imageGen", "__end__")

export const graph = workFlow.compile();

