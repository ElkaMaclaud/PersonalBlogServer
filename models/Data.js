const { Schema, model } = require("mongoose");

const Data = new Schema({
  resume: { type: Object, ref: "Resume" },
  posts: [{ type: Object, ref: "Post" }],
  works: [{ type: Object, ref: "Work" }],
  contact: { phone: Number, website: String, adress: String, git: String, socialMedia: String },
});

module.exports = model("Data", Data);
