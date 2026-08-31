const multer = require("multer");

// Memory storage, not disk: a serverless filesystem is read-only apart from
// /tmp, and /tmp is wiped between invocations. The route reads req.file.buffer
// and persists the bytes to MongoDB.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // pdf-parse only handles PDF. The old filter also allowed DOC/DOCX, which
  // guaranteed a 500 further down the route. Reject them up front instead.
  if (file.mimetype === "application/pdf") {
    return cb(null, true);
  }
  cb(new Error("Only PDF files are supported."));
};

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Vercel caps a serverless function request body at roughly 4.5 MB, and a
    // single BSON document at 16 MB. 4 MB stays inside both, with headroom for
    // the extracted text and analysis fields on the same document.
    fileSize: MAX_FILE_BYTES,
    files: 1,
    fields: 10,
  },
});

module.exports = upload;
module.exports.MAX_FILE_BYTES = MAX_FILE_BYTES;
