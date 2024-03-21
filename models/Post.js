const { Schema, model } = require("mongoose");

const Post = new Schema({
  header: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = model("Post", Post);
