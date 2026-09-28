import { tavily } from "../config/tavilyTool.js"

export const searchAgent = async (state) => {
    try {
        const results = await tavily.invoke({
            query: state.prompt
        });
        return {
            ...state,
            searchResults: results.results,
            searchImages: results.images || []
        };
    } catch (error) {
        return {
            ...state,
            searchResults: [],
            searchImages: [],
        }
    }
}