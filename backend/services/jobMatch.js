const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeJobMatch(resumeText, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

const prompt = `
You are an ATS (Applicant Tracking System).

Your job is NOT to guess.

Your job is to compare.

You will receive:

1. Candidate Resume
2. Job Description

-----------------------------------

STEP 1

Extract ALL technical skills from the resume.

STEP 2

Extract ALL required technical skills from the Job Description.

STEP 3

Compare them STRICTLY.

If a skill exists in the resume, it MUST NOT appear in missingSkills.

Do NOT assume.

Do NOT infer.

Do NOT hallucinate.

-----------------------------------

Then compare:

- Programming Languages
- Frameworks
- Databases
- Developer Tools
- Cloud Skills
- APIs
- Core CS Concepts
- Experience
- Education

-----------------------------------

Return ONLY JSON.
IMPORTANT:

Return plain text only.

Do NOT use Markdown.

Do NOT use **bold**

Do NOT use __bold__

Do NOT use *italic*

Do NOT use bullet symbols like • or -

Do NOT wrap text in backticks.

Do NOT use headings.

Do NOT use numbered lists.

Every string inside the JSON must be plain text only.

For example:

Wrong:
"**React** is missing."

Correct:
"React is missing."

Wrong:
"Improve **project descriptions**."

Correct:
"Improve project descriptions."

Wrong:
"Experience with **Node.js**, **Express.js**, and **MongoDB**."

Correct:
"Experience with Node.js, Express.js, and MongoDB."

{
  "overallMatch": 0,

  "recommendation": "",

  "skillsMatch": 0,

  "keywordMatch": 0,

  "experienceMatch": 0,

  "educationMatch": 0,

  "matchingSkills": [],

  "missingSkills": [],

  "matchedKeywords": [],

  "missingKeywords": [],

  "experienceGap": "",

  "educationComment": "",

  "strengths": [],

  "weaknesses": [],

  "suggestions": []
}

Rules

overallMatch:
0-100

skillsMatch:
0-100

keywordMatch:
0-100

experienceMatch:
0-100

educationMatch:
0-100

recommendation must be exactly one of

"Excellent Match"

"Good Match"

"Needs Improvement"

VERY IMPORTANT

If the resume contains:

React.js

Node.js

Express.js

MongoDB

Git

REST APIs

DO NOT place them inside missingSkills.

If the resume contains C++, HTML, CSS, JavaScript etc, recognize them correctly.

missingSkills should ONLY contain skills that appear in the Job Description but NOT in the Resume.

Resume:

${resumeText}

----------------------------------------------------

Job Description:

${jobDescription}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    console.log("========== JOB MATCH ==========");
    console.log(response);
    console.log("===============================");

const cleaned = response
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .replace(/\*\*(.*?)\*\*/g, "$1")   // **bold**
  .replace(/__(.*?)__/g, "$1")       // __bold__
  .replace(/\*(.*?)\*/g, "$1")       // *italic*
  .replace(/`(.*?)`/g, "$1")         // `code`
  .trim();
  
    return JSON.parse(cleaned);

  } catch (err) {

    console.log(err);

    return {
      overallMatch: 0,
      recommendation: "Needs Improvement",

      matchingSkills: [],
      missingSkills: [],

      experienceGap: "Unable to analyze.",

      educationMatch: "Unable to analyze.",

      keywordMatch: 0,

      matchedKeywords: [],
      missingKeywords: [],

      strengths: [],

      weaknesses: [],

      suggestions: [
        "Unable to analyze Job Description currently."
      ]
    };
  }
}

module.exports = analyzeJobMatch;