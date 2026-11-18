const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseModelJson,
  stripMarkdown,
  stripMarkdownDeep,
} = require("../services/parseModelJson");

test("parses plain JSON", () => {
  assert.deepEqual(parseModelJson('{"score": 80}'), { score: 80 });
});

test("parses JSON wrapped in a markdown code fence", () => {
  const reply = '```json\n{"score": 72, "skills": ["React"]}\n```';
  assert.deepEqual(parseModelJson(reply), { score: 72, skills: ["React"] });
});

test("ignores text before and after the JSON object", () => {
  const reply = 'Here is the result:\n{"ok": true}\n` extra';
  assert.deepEqual(parseModelJson(reply), { ok: true });
});

test("throws when the reply has no JSON object", () => {
  assert.throws(() => parseModelJson("Sorry, I can't help."), /No JSON object/);
});

test("throws on truncated JSON", () => {
  assert.throws(() => parseModelJson('{"score": 80, "summary": "cut off'));
});

test("stripMarkdown removes bold, italic and code marks", () => {
  assert.equal(
    stripMarkdown("Use **React**, *Node.js* and `Git`."),
    "Use React, Node.js and Git."
  );
});

test("stripMarkdown leaves non-strings unchanged", () => {
  assert.equal(stripMarkdown(42), 42);
  assert.equal(stripMarkdown(null), null);
});

test("stripMarkdownDeep cleans nested arrays and objects", () => {
  const input = {
    overallMatch: 57,
    matchingSkills: ["**Java**", "SDLC"],
    nested: { note: "__important__" },
  };

  assert.deepEqual(stripMarkdownDeep(input), {
    overallMatch: 57,
    matchingSkills: ["Java", "SDLC"],
    nested: { note: "important" },
  });
});
