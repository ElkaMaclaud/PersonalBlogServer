const { Schema, model } = require("mongoose");

const Work = new Schema({
  header: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = model("Work", Work);
