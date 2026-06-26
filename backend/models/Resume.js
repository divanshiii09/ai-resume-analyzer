const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
},fileName: {
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

atsScore: {
  type: Number,
  default: 0,},
},
{
timestamps: true,
}
);

module.exports = mongoose.model(
"Resume",
resumeSchema
);
