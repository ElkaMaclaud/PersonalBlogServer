const { Schema, model } = require("mongoose");

const Resume = new Schema({
  name: { type: String, required: true },
  file: { type: String, required: true },
  avatar: { type: String },
  profession: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = model("Resume", Resume);
