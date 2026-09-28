import { TavilySearch } from "@langchain/tavily";

export const tavily = new TavilySearch({
    maxResults: 5,
    topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    includeImages: true,
    // includeImageDescriptions: false,
    // searchDepth: "basic",
    // timeRange: "day",
    // includeDomains: [],
    // excludeDomains: [],
});