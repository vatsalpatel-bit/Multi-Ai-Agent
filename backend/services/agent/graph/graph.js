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

workFlow.Node("router", router)
workFlow.Node("chat", chatAgent)
workFlow.Node("search", searchAgent)
workFlow.Node("coding", codingAgent)
workFlow.Node("pdf", pdfGenAgent)
workFlow.Node("ppt", pptGenAgent)
workFlow.Node("image", imageGenAgent)

workFlow.addEdge("__start__", "router")
workFlow.addConditionalEdges("router",)