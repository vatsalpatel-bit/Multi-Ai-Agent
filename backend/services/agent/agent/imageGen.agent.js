import axios from "axios";
import { getAgent } from "../config/llmModels.js";
import { uploadBufferToS3 } from "../config/s3Service.js";

export const imageGenAgent = async (state) => {
    try {
        const llm = getAgent("imageGen");
        const res = await llm.invoke(`
You are an elite AI image prompt engineer.

Your task is to convert the user's request into a highly detailed, professional image generation prompt.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Additional Instructions:
1. Understand the user's intent carefully.
2. Expand short or simple requests into detailed visual descriptions.
3. Describe the subject, environment, background, lighting, camera angle, and atmosphere.
4. Specify realistic textures, materials, shadows, and reflections where appropriate.
5. Use professional photography terminology.
6. Maintain the original meaning of the user's request.
7. Avoid unnecessary objects or unrelated details.
8. Make the prompt suitable for advanced AI image generation models.

Return only the final image generation prompt.
Do not include explanations, headings, or commentary.

User Request:
${state.prompt}
`);
        const prompt = res.content.trim();
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`;
        const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const fileBuffer = Buffer.from(imageRes.data);
        const fileName = `image-${Date.now()}.png`;
        const url = await uploadBufferToS3(fileBuffer, fileName, "image/png")
        const image = [url];
        return {
            ...state,
            searchImages: image,
            aiResponse: `

📥 [Download Image](${url})

⏳ Link expires in 60 minutes.
`,

        }
    } catch (error) {

    }
}