const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an ATS Resume Expert.

Analyze this resume and respond ONLY in JSON.

Use this exact format:

{
  "score": 85,
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "suggestions": [
    "...",
    "...",
    "..."
  ]
}

Resume:

${text}
`;

  const result = await model.generateContent(prompt);

  const response = await result.response;

  return response.text();
}

module.exports = analyzeResume;