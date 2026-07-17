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

    filePath: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Resume", resumeSchema);