import { getAgent } from "../config/llmModels.js";

export const codingAgent = async (state) => {
    const intentLlm = getAgent("Intent");
    const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);
    const intent = intentRes.content;
    if (intent == "CODE_GENERATION") {
        
    }
};
