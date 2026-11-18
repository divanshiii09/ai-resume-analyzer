const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const extractPdfText = require("../services/extractPdfText");

const sample = fs.readFileSync(path.join(__dirname, "fixtures/sample-resume.pdf"));

test("extracts the text of a PDF", async () => {
  const text = await extractPdfText(sample);
  assert.match(text, /Sample Resume/);
  assert.match(text, /React/);
});

test("works when the buffer is a slice of a larger memory block", async () => {
  // On Vercel, multer hands over a Buffer that starts partway into a larger
  // shared block. The old pdf-parse library failed on this with "bad XRef entry".
  const block = Buffer.alloc(sample.length + 40000);
  sample.copy(block, 19112);
  const slice = block.subarray(19112, 19112 + sample.length);

  const text = await extractPdfText(slice);
  assert.match(text, /Sample Resume/);
});

test("keeps working after a failed parse", async () => {
  await assert.rejects(extractPdfText(Buffer.from("not a pdf")));
  const text = await extractPdfText(sample);
  assert.match(text, /Sample Resume/);
});
