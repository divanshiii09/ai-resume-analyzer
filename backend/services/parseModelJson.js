// Gemini sometimes wraps its reply in a markdown fence, or leaves a stray
// backtick after the closing brace, even with responseMimeType set to
// application/json. Slicing from the first "{" to the last "}" is immune to
// fences, preambles and trailing junk.
//
// This replaces regex fence-stripping, which was fragile (an unbalanced
// backtick survived and broke JSON.parse) and actively destructive: running
// markdown regexes over the raw JSON corrupted any string value containing
// "*" or a backtick.
function parseModelJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model response");
  }

  return JSON.parse(text.slice(start, end + 1));
}

// Strip markdown emphasis from one string. Safe on parsed values; running it
// on raw JSON is what caused the corruption described above.
const stripMarkdown = (value) =>
  typeof value === "string"
    ? value
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .trim()
    : value;

// Apply stripMarkdown to every string in an already-parsed structure.
function stripMarkdownDeep(node) {
  if (Array.isArray(node)) return node.map(stripMarkdownDeep);

  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, stripMarkdownDeep(v)])
    );
  }

  return stripMarkdown(node);
}

module.exports = { parseModelJson, stripMarkdown, stripMarkdownDeep };
