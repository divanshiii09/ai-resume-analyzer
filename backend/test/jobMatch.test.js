const test = require("node:test");
const assert = require("node:assert/strict");

// Replace the Gemini SDK with a fake before jobMatch.js loads it, so these
// tests never call the real API and don't need a key or network access.
let nextReply = null;

const sdkPath = require.resolve("@google/generative-ai");
require.cache[sdkPath] = {
  id: sdkPath,
  filename: sdkPath,
  loaded: true,
  exports: {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async () => {
            if (nextReply instanceof Error) throw nextReply;
            return { response: { text: () => nextReply, candidates: [] } };
          },
        };
      }
    },
  },
};

const analyzeJobMatch = require("../services/jobMatch");

// jobMatch.js logs failures on purpose; keep the test output clean.
console.error = () => {};

test("returns the parsed result when Gemini replies with JSON", async () => {
  nextReply = '```json\n{"overallMatch": 75, "matchingSkills": ["**Java**"]}\n```';

  const result = await analyzeJobMatch("resume", "job description");

  assert.equal(result.overallMatch, 75);
  assert.deepEqual(result.matchingSkills, ["Java"]);
});

test("throws JOB_MATCH_FAILED when the Gemini call fails", async () => {
  nextReply = new Error("503 Service Unavailable");

  await assert.rejects(analyzeJobMatch("resume", "jd"), {
    code: "JOB_MATCH_FAILED",
  });
});

test("throws JOB_MATCH_FAILED instead of a fake 0% result on bad JSON", async () => {
  nextReply = "not json at all";

  await assert.rejects(analyzeJobMatch("resume", "jd"), {
    code: "JOB_MATCH_FAILED",
  });
});
