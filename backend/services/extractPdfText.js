// Extracts plain text from a PDF.
//
// Uses unpdf (a maintained, serverless-friendly build of Mozilla's pdf.js).
// It replaces pdf-parse 1.1.1, whose bundled 2017 copy of pdf.js failed on
// Vercel with "bad XRef entry" for valid PDFs, and kept failing for later
// uploads in the same server process.
//
// unpdf is ESM-only, so it is loaded with a dynamic import from this
// CommonJS backend.
async function extractPdfText(buffer) {
  const { getDocumentProxy, extractText } = await import("unpdf");

  // Copy into a standalone Uint8Array. multer's buffer can be a view into a
  // larger shared memory block, and pdf.js may take ownership of the bytes.
  const document = await getDocumentProxy(new Uint8Array(buffer));

  try {
    const { text } = await extractText(document, { mergePages: true });
    return (text || "").trim();
  } finally {
    // Free pdf.js resources held for this document.
    await document.loadingTask.destroy();
  }
}

module.exports = extractPdfText;
