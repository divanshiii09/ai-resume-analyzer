const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(text) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an ATS Resume Expert.

Analyze the following resume and respond ONLY with valid JSON.

Return exactly this structure:

{
  "score": 86,
  "skillsMatch": 82,
  "formatting": 90,
  "keywords": 84,
  "status": "Good Match",
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

Rules:
- score must be between 0 and 100.
- skillsMatch must be between 0 and 100.
- formatting must be between 0 and 100.
- keywords must be between 0 and 100.
- status must be exactly one of:
  "Excellent Match"
  "Good Match"
  "Needs Improvement"
- Give 3-5 strengths.
- Give 3-5 weaknesses.
- Give 3-5 suggestions.
- Return ONLY JSON.
- Do not use markdown.
- Do not use \`\`\`json.

Resume:

${text}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (err) {
    console.log("========== GEMINI ERROR ==========");
    console.log(err.message);
    console.log("==================================");

    // Return default analysis so upload never fails
    return {
      score: 70,
      skillsMatch: 70,
      formatting: 70,
      keywords: 70,
      status: "Needs Improvement",
      strengths: [
        "Resume uploaded successfully."
      ],
      weaknesses: [
        "AI analysis unavailable."
      ],
      suggestions: [
        "Gemini is currently busy. Please analyze again later."
      ]
    };
  }
}

module.exports = analyzeResume;