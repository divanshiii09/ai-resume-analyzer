const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    // LEGACY. Documents created before the Vercel migration hold
    // "/uploads/<name>" here and have no fileData. No longer required, and
    // never written by new uploads -- kept so old documents still validate.
    filePath: {
      type: String,
    },

    // Original PDF bytes. select:false is the important part: it keeps the
    // buffer out of every query result unless explicitly requested, so the
    // dashboard list route does not return megabytes of base64 per resume.
    fileData: {
      type: Buffer,
      select: false,
    },

    contentType: {
      type: String,
      default: "application/pdf",
    },

    // Lets the client know whether an original file exists WITHOUT selecting
    // the buffer. 0 means a legacy document -- hide the "Resume" button.
    fileSize: {
      type: Number,
      default: 0,
    },

    userEmail: {
      type: String,
      required: true,
    },
   resumeText: {
      type: String,
      default: "",
    },
  atsScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Needs Improvement",
    },

    summary: {
      type: String,
      default: "",
    },

    skillsMatch: {
      type: Number,
      default: 0,
    },

    detectedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    formattingScore: {
      type: Number,
      default: 0,
    },

    formattingIssues: {
      type: [String],
      default: [],
    },

    keywordScore: {
      type: Number,
      default: 0,
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },
    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    recommendedRoles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ userEmail: 1, createdAt: -1 });

module.exports = mongoose.model("Resume", resumeSchema);