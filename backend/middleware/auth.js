const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ message: "Server misconfigured" });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired" });
  }
}

// Emails are stored as given but compared case-insensitively so a differently
// cased login cannot lock a user out of their own resumes.
const sameUser = (a = "", b = "") =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

module.exports = requireAuth;
module.exports.sameUser = sameUser;
