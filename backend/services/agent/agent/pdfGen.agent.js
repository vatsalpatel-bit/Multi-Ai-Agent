
import { getAgent } from "../config/llmModels.js";
import { uploadBufferToS3 } from "../config/s3Service.js";
import { generatePDF } from "../utils/generatePdf.js";

import { randomUUID } from "node:crypto";

export const pdfGenAgent = async (state) => {
  try {


    const llm = getAgent("ppt");

    const prompt = `
You are an expert professional document writer, content strategist, and technical documentation specialist.

Your task is to transform the user's topic into a well-structured, informative, professional, and high-quality document.

OUTPUT RULES:

1. Return ONLY valid JSON.
2. Do NOT return Markdown code fences.
3. Do NOT return explanations or conversational text.
4. Follow the exact JSON structure below.
5. Ensure all JSON strings are properly escaped.
6. Never include trailing commas.
7. All fields must contain meaningful content.
8. Do not invent statistics, facts, references, or claims.

REQUIRED JSON STRUCTURE:

{
    "title": "",
    "subtitle": "",
    "sections": [
        {
            "heading": "",
            "points": []
        }
    ]
}

CONTENT REQUIREMENTS:

TITLE:
- Create a clear, professional, engaging title.
- Accurately represent the document's topic.
- Avoid unnecessarily long titles.

SUBTITLE:
- Write a concise description explaining the document's purpose.
- Provide context about what the reader will learn.

SECTIONS:
- Generate 4-8 logically organized sections.
- Arrange sections in a meaningful sequence.
- Each section must have a descriptive heading.
- Avoid duplicate or repetitive sections.

BULLET POINTS:
- Each section must contain 3-6 informative bullet points.
- Each point must provide meaningful information.
- Use clear, concise, grammatically correct sentences.
- Explain important concepts rather than simply naming them.
- Include practical examples where relevant.
- Avoid unnecessary repetition and filler content.

WRITING STYLE:
- Professional and informative.
- Clear and easy to understand.
- Well-organized and logically structured.
- Educational and reader-friendly.
- Detailed enough to provide real value.

TOPIC-SPECIFIC INSTRUCTIONS:

For technical topics:
- Explain concepts, architecture, technologies, and implementation.
- Include practical use cases and best practices.
- Discuss important challenges and solutions.

For business topics:
- Cover objectives, strategies, operations, opportunities, and risks.
- Include practical recommendations.

For educational topics:
- Explain fundamental concepts before advanced concepts.
- Include examples and real-world applications.
- Build knowledge progressively.

For general topics:
- Cover background, important concepts, benefits, challenges, and conclusions.

QUALITY CHECK:
- Verify valid JSON.
- Ensure 4-8 sections.
- Ensure 3-6 points per section.
- Avoid duplicate information.
- Maintain logical document flow.

USER TOPIC:

${state.prompt}

Return ONLY the final JSON object.
`;

    const res = await llm.invoke(prompt);

    const content =
      typeof res.content === "string"
        ? res.content
        : JSON.stringify(res.content);


    const cleanContent = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const data = JSON.parse(cleanContent);


    if (
      typeof data.title !== "string" ||
      !data.title.trim() ||
      typeof data.subtitle !== "string" ||
      !Array.isArray(data.sections) ||
      data.sections.length === 0
    ) {
      throw new Error("Invalid document structure from AI");
    }

    for (const section of data.sections) {
      if (
        typeof section.heading !== "string" ||
        !section.heading.trim() ||
        !Array.isArray(section.points) ||
        section.points.length === 0 ||
        !section.points.every(
          (point) => typeof point === "string"
        )
      ) {
        throw new Error("Invalid document section structure");
      }
    }

    const pdfBuffer = await generatePDF(data);

    if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
      throw new Error("PDF generation returned an invalid buffer");
    }


    const fileName = `pdf-${randomUUID()}.pdf`;

    const downloadUrl = await uploadBufferToS3(
      pdfBuffer,
      fileName,
      "application/pdf"
    );

    if (!downloadUrl) {
      throw new Error("Failed to generate PDF download URL");
    }

    return {
      aiResponse: `
# 📄 PDF Generated Successfully

**${data.title}**

✨ Your professional document is ready!

📥 [Download PDF](${downloadUrl})

⏳ Link expires in 60 minutes.
`,
    };

  } catch (error) {

    console.error("PDF Agent Error:", error);

    return {
      aiResponse: `
❌ **PDF Generation Failed**

${error.message || "Something went wrong while generating your PDF."}

Please try again.
`,
    };
  }
};
