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

    // Overall ATS Score
    atsScore: {
      type: Number,
      default: 0,
    },

    // Individual Scores
    skillsMatch: {
      type: Number,
      default: 0,
    },

    formattingScore: {
      type: Number,
      default: 0,
    },

    keywordScore: {
      type: Number,
      default: 0,
    },

    // Match Status
    status: {
      type: String,
      default: "Needs Improvement",
    },

    // AI Feedback
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);