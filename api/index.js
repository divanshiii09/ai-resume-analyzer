// Vercel serverless function entry. vercel.json rewrites every /api/* request
// here and Express does the routing from there.
const { Readable } = require("stream");

const app = require("../backend/app");

module.exports = (req, res) => {
  // Safety net. Vercel preserves the original request URL across an internal
  // rewrite, so req.url normally already reads "/api/login". This keeps the
  // function correct even if that changes or the rewrite is edited.
  if (!req.url.startsWith("/api")) {
    req.url = "/api" + (req.url === "/" ? "" : req.url);
  }

  // @vercel/node may pre-read the request body into a Buffer before handing the
  // request over. multer/busboy need to consume the raw stream themselves, and
  // an already-drained stream makes the upload hang or fail with "Unexpected
  // end of form". If the body has been buffered, replay it as a fresh stream.
  // This is a no-op when the runtime leaves the stream untouched.
  const contentType = req.headers["content-type"] || "";

  if (
    contentType.startsWith("multipart/form-data") &&
    Buffer.isBuffer(req.body)
  ) {
    const buffered = req.body;
    const replay = Readable.from(buffered);

    req.headers["content-length"] = String(buffered.length);

    for (const method of [
      "on",
      "once",
      "addListener",
      "removeListener",
      "off",
      "pipe",
      "unpipe",
      "read",
      "resume",
      "pause",
      "setEncoding",
    ]) {
      req[method] = replay[method].bind(replay);
    }
  }

  return app(req, res);
};
