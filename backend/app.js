require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Require the internal module directly rather than the pdf-parse wrapper: the
// wrapper's `!module.parent` debug self-test reads a fixture PDF off disk and
// crashes when the module graph is bundled.
const pdf = require("pdf-parse/lib/pdf-parse.js");

const connectDB = require("./config/db");
const upload = require("./middleware/upload");
const requireAuth = require("./middleware/auth");
const { sameUser } = require("./middleware/auth");
const User = require("./models/User");
const Resume = require("./models/Resume");
const analyzeResume = require("./services/gemini");
const analyzeJobMatch = require("./services/jobMatch");

const app = express();

// Harmless when the API is same-origin on Vercel; needed for local Vite on :5173.
app.use(cors());

// The default 100 KB limit could reject a long pasted job description.
app.use(express.json({ limit: "1mb" }));

/* ---------------- HEALTH CHECK ---------------- */
// Registered before the DB middleware so it can tell "the function is broken"
// apart from "the database is unreachable" -- the two failures look identical
// from the outside otherwise.
app.get("/api/test", async (req, res) => {
  try {
    await connectDB();
    res.json({ message: "Backend working", database: "connected" });
  } catch (err) {
    res.status(503).json({
      message: "Backend working",
      database: "unavailable",
      error: err.message,
    });
  }
});

// Open (or reuse) the Mongo connection per request. Must come before the routes.
// A cold instance connects here; a warm one returns the cached connection.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connect failed:", err.message);
    res.status(503).json({ message: "Database unavailable" });
  }
});

/* ---------------- REGISTER ---------------- */

app.post("/api/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
});

/* ---------------- LOGIN ---------------- */

app.post("/api/login", async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const { email, password } = req.body || {};

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password || "", user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

/* ---------------- SAVE RESUME ---------------- */

app.post(
  "/api/resume",
  requireAuth,
  upload.single("resume"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Ignore any client-supplied email: the resume belongs to the caller.
      const userEmail = req.user.email;

      // multer's memoryStorage already gave us the bytes -- no disk read.
      const pdfData = await pdf(req.file.buffer);
      const extractedText = (pdfData.text || "").trim();

      if (!extractedText) {
        return res.status(422).json({
          message:
            "Could not read any text from this PDF. It may be a scanned image.",
        });
      }

      // Deliberately not logging the resume text: it is PII, it would be
      // retained in platform logs, and serializing tens of KB per request costs
      // real time.
      console.log(
        `Parsed ${extractedText.length} chars from ${req.file.originalname}`
      );

      // Cap the prompt: input size is the main driver of Gemini latency variance.
      const analysis = await analyzeResume(extractedText.slice(0, 20000));

      let status = "Needs Improvement";
      if (analysis.score >= 85) status = "Excellent Match";
      else if (analysis.score >= 70) status = "Good Match";
      analysis.status = status;

      const resume = await Resume.create({
        title: req.file.originalname,
        fileName: req.file.originalname,

        // Replaces the old on-disk filePath.
        fileData: req.file.buffer,
        contentType: req.file.mimetype,
        fileSize: req.file.size,

        userEmail,
        resumeText: extractedText,
        atsScore: analysis.score,
        status: analysis.status,
        summary: analysis.summary,
        skillsMatch: analysis.skillsMatch,
        detectedSkills: analysis.detectedSkills,
        missingSkills: analysis.missingSkills,
        formattingScore: analysis.formatting,
        formattingIssues: analysis.formattingIssues,
        keywordScore: analysis.keywords,
        missingKeywords: analysis.missingKeywords,
        experienceLevel: analysis.experienceLevel,
        industry: analysis.industry,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        recommendedRoles: analysis.recommendedRoles,
      });

      // select:false does not apply to a document we just created -- `resume`
      // still holds the buffer. Strip it, or the response carries the whole
      // PDF back as base64.
      const { fileData, ...safeResume } = resume.toObject();

      res.json({ message: "Resume uploaded successfully", resume: safeResume });
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------- ANALYZE AGAINST JOB DESCRIPTION ---------------- */

app.post("/api/analyze-job", requireAuth, async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body || {};

    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is required" });
    }

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({ message: "Job Description is required" });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!sameUser(resume.userEmail, req.user.email)) {
      return res.status(403).json({ message: "Not your resume" });
    }

    const result = await analyzeJobMatch(
      (resume.resumeText || "").slice(0, 20000),
      jobDescription.slice(0, 8000)
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/* ---------------- GET RESUMES ---------------- */

app.get("/api/resumes/:email", requireAuth, async (req, res, next) => {
  try {
    if (!sameUser(req.params.email, req.user.email)) {
      return res.status(403).json({ message: "Not your resumes" });
    }

    const resumes = await Resume.find({
      userEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    next(error);
  }
});

/* ---------------- GET LATEST RESUME BY EMAIL ---------------- */
// Registered before /api/resume/:id so the literal segment always wins.

app.get("/api/resume/latest/:email", requireAuth, async (req, res, next) => {
  try {
    if (!sameUser(req.params.email, req.user.email)) {
      return res.status(403).json({ message: "Not your resumes" });
    }

    const resume = await Resume.findOne({
      userEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(resume);
  } catch (error) {
    next(error);
  }
});

/* ---------------- DOWNLOAD ORIGINAL PDF ---------------- */

app.get("/api/resume/:id/file", requireAuth, async (req, res, next) => {
  try {
    // "+fileData" adds the select:false field while keeping the normal ones.
    const resume = await Resume.findById(req.params.id).select("+fileData");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!sameUser(resume.userEmail, req.user.email)) {
      return res.status(403).json({ message: "Not your resume" });
    }

    if (!resume.fileData || resume.fileData.length === 0) {
      // Legacy document: the bytes only ever existed on the old server's disk.
      return res.status(410).json({
        message: "The original file for this resume is no longer available.",
      });
    }

    const filename = (resume.fileName || "resume.pdf").replace(
      /["\\\r\n]/g,
      ""
    );

    res.setHeader("Content-Type", resume.contentType || "application/pdf");
    res.setHeader("Content-Length", resume.fileData.length);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    res.send(resume.fileData);
  } catch (error) {
    next(error);
  }
});

/* ---------------- GET RESUME BY ID ---------------- */

app.get("/api/resume/:id", requireAuth, async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!sameUser(resume.userEmail, req.user.email)) {
      return res.status(403).json({ message: "Not your resume" });
    }

    res.json(resume);
  } catch (error) {
    next(error);
  }
});

/* ---------------- DELETE RESUME ---------------- */

app.delete("/api/resume/:id", requireAuth, async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!sameUser(resume.userEmail, req.user.email)) {
      return res.status(403).json({ message: "Not your resume" });
    }

    // No filesystem cleanup: the PDF bytes live on the document, so deleting
    // the document deletes the file.
    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// JSON 404 for unknown API paths, so a typo never falls through to the SPA.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler LAST. Without it multer failures surface as HTML, which the
// frontend cannot parse.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum size is 4 MB."
        : err.message;
    return res.status(400).json({ message });
  }

  if (err && /Only PDF/i.test(err.message || "")) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
