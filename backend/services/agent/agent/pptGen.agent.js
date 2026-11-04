import { getAgent } from "../config/llmModels.js"
import { uploadBufferToS3 } from "../config/s3Service.js";
import { generatePPT } from "../utils/generatePpt.js";
import { randomUUID } from "node:crypto";

export const pptGenAgent = async (state) => {
    try {
        console.log("1")
        const llm = getAgent("ppt");
        const prompt = `You are a senior presentation strategist, professional PowerPoint content designer, and business storytelling expert.

Your task is to transform the user's topic into a professional, well-structured presentation suitable for business meetings, educational purposes, technical presentations, and professional audiences.

## OUTPUT FORMAT

Return exactly this JSON structure:

{
  "title": "Presentation Title",
  "subtitle": "Short and meaningful presentation description",
  "slides": [
    {
      "title": "Slide Title",
      "points": [
        "First concise and meaningful point",
        "Second concise and meaningful point",
        "Third concise and meaningful point",
        "Fourth concise and meaningful point",
        "Fifth concise and meaningful point"
      ]
    }
  ]
}

## PRESENTATION STRUCTURE

Generate exactly 6 content slides.

Organize the slides according to the topic. Use this general structure when appropriate:

1. Introduction and Overview
2. Background and Core Concepts
3. Main Components or Key Features
4. Working Process, Architecture, or Detailed Explanation
5. Benefits, Applications, Challenges, or Real-World Examples
6. Summary, Key Takeaways, and Future Scope

Adapt these sections intelligently when the topic requires a different structure. Do not force irrelevant sections.

## CONTENT RULES

- Every slide must contain 4–6 bullet points.
- Each bullet point should communicate one clear idea.
- Keep bullet points concise, informative, and presentation-friendly.
- Prefer approximately 8–20 words per bullet point.
- Use accurate terminology relevant to the topic.
- Explain technical concepts in clear, understandable language.
- Include relevant examples, statistics, or practical applications when appropriate and reliable.
- Maintain a logical flow from one slide to the next.
- Avoid repeating the same information across slides.
- Maintain consistent depth and quality throughout the presentation.
- Make content valuable to the intended audience.
- Use professional and engaging language.
- Do not invent statistics, facts, research findings, or references.
- Do not include unsupported claims.

## SLIDE DESIGN AWARENESS

Although you are generating content rather than designing the actual slides:

- Write titles that are short, specific, and meaningful.
- Keep content visually scannable.
- Avoid long paragraphs.
- Avoid unnecessary explanations.
- Make each slide communicate one central message.
- Use parallel wording and consistent terminology.
- Ensure bullet points are suitable for PowerPoint layouts.

## STRICT OUTPUT RULES

- Return ONLY valid JSON.
- Do not use Markdown formatting.
- Do not use Markdown code fences.
- Do not include introductory or concluding explanations outside the JSON.
- Do not include comments.
- Do not add extra JSON properties.
- Use double quotes for all JSON keys and string values.
- Escape special characters correctly.
- Ensure all arrays and objects are properly closed.
- Generate exactly 6 slide objects.
- Every slide must have 4–6 points.

## USER TOPIC

${state.prompt}`;

        const response = await llm.invoke(prompt);
        console.log("2")
        const content =
            typeof response.content === "string"
                ? response.content
                : JSON.stringify(response.content);
        console.log("2.1")
        // Step 2: Clean LLM response
        const cleanContent = content
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
        console.log("2.2")
        const data = JSON.parse(cleanContent);
        console.log("2.3")
        // Step 3: Generate PPTX Buffer
        const pptBuffer = await generatePPT(data);
        console.log("2.4")
        if (!Buffer.isBuffer(pptBuffer) || !pptBuffer.length) {
            throw new Error("PowerPoint generation failed");
        }

        // Step 4: Generate unique file name
        const fileName = `ppt-${randomUUID()}.pptx`;
        console.log("3")
        // Step 5: Upload Buffer to S3
        const downloadUrl = await uploadBufferToS3(
            pptBuffer,
            fileName,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        );
        console.log("4")
        return {
            aiResponse: `# PowerPoint Generated Successfully

**${data.title}**

Your presentation is ready with 6 content slides and a cover slide.

[Download PowerPoint](${downloadUrl})

Link expires in 60 minutes.`,

        };
    } catch (error) {

    }
}