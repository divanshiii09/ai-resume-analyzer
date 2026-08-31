const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Kept below the platform function timeout so a slow generation surfaces as a
// real error message from the catch block rather than an opaque platform 504.
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 45000);

async function analyzeResume(text) {
  try {
    const model = genAI.getGenerativeModel(
      {
        model: "gemini-2.5-flash",
        generationConfig: {
          // Ask for strict JSON so the fenced-code stripping below becomes a
          // fallback rather than the primary parse path.
          responseMimeType: "application/json",
          // gemini-2.5-flash charges internal reasoning against this budget,
          // so a tight cap truncates the JSON body mid-string. The request
          // timeout above is what actually bounds latency.
          maxOutputTokens: 16384,
        },
      },
      { timeout: GEMINI_TIMEOUT_MS }
    );

    const prompt = `
You are a Senior Technical Recruiter and ATS evaluator.

Your task is to evaluate resumes exactly like a recruiter.

IMPORTANT:
Do NOT randomly assign scores.

Evaluate independently:

1. Formatting (0-100)
2. Skills Match (0-100)
3. Keyword Match (0-100)
4. Projects Quality
5. Experience
6. Education
7. Readability
8. Action Verbs
9. ATS Friendliness

After evaluating these categories, calculate an overall ATS score.

First determine:

- Industry
- Target Job Role
- Experience Level

Then generate recruiter feedback.

Return ONLY valid JSON.

{
  "score":0,
  "skillsMatch":0,
  "formatting":0,
  "keywords":0,
  "status":"",
  "summary":"",
  "industry":"",
  "experienceLevel":"",
  "detectedSkills":[],
  "missingSkills":[],
  "formattingIssues":[],
  "missingKeywords":[],
  "strengths":[],
  "weaknesses":[],
  "suggestions":[],
  "recommendedRoles":[]
}

Rules:

score -> integer 0-100

skillsMatch -> integer

formatting -> integer

keywords -> integer

status must be exactly one of

Excellent Match

Good Match

Needs Improvement

summary should be 2-3 lines like a recruiter.

detectedSkills should contain 8-15 technical skills.

missingSkills should contain relevant missing skills.

formattingIssues should contain formatting improvements.

missingKeywords should contain ATS keywords.

strengths should contain 4-6 points.

weaknesses should contain 4-6 points.

suggestions should contain 4-6 actionable suggestions.

recommendedRoles should contain 5 suitable job roles.

IMPORTANT:

Return plain text only.

Do NOT use Markdown.

Do NOT use **bold**.

Do NOT use *italics*.

Do NOT use bullet symbols.

Do NOT use headings.

Every string in the JSON must be plain text suitable for direct display in a React application.

Resume:

${text}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const finishReason = result.response.candidates?.[0]?.finishReason;

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      // A truncated response would otherwise fall through to the generic
      // fallback object, hiding the real cause. Say what happened.
      console.error(
        `Gemini JSON parse failed (finishReason=${finishReason}, ` +
          `${cleaned.length} chars). Tail: ${JSON.stringify(cleaned.slice(-160))}`
      );
      throw parseErr;
    }
const cleanText = (text = "") =>
  typeof text === "string"
    ? text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .trim()
    : text;

parsed.summary = cleanText(parsed.summary);

parsed.strengths = parsed.strengths?.map(cleanText) || [];

parsed.weaknesses = parsed.weaknesses?.map(cleanText) || [];

parsed.suggestions = parsed.suggestions?.map(cleanText) || [];

parsed.detectedSkills = parsed.detectedSkills?.map(cleanText) || [];

parsed.missingSkills = parsed.missingSkills?.map(cleanText) || [];

parsed.formattingIssues = parsed.formattingIssues?.map(cleanText) || [];

parsed.missingKeywords = parsed.missingKeywords?.map(cleanText) || [];

parsed.recommendedRoles = parsed.recommendedRoles?.map(cleanText) || [];

    return parsed;
  } catch (err) {
    console.log(err);

   return {
      score: 65,

      skillsMatch: 65,

      formatting: 70,

      keywords: 60,

      status: "Needs Improvement",

      summary:
        "AI analysis could not be generated.",

      industry: "Unknown",

      experienceLevel: "Unknown",

      detectedSkills: [],

      missingSkills: [],

      formattingIssues: [],

      missingKeywords: [],

      strengths: [],

      weaknesses: [],

      suggestions: [
        "Please try again."
      ],

      recommendedRoles: [],
    };
  }
}module.exports = analyzeResume;