const { Schema, model } = require("mongoose");

const Post = new Schema({
  id: { type: String, required: true },
  header: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = model("Post", Post);
