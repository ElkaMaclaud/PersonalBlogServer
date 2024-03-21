const { Schema, model } = require("mongoose");

const Data = new Schema({
  resume: { type: Object, ref: "Resume" },
  posts: [{ type: Array, ref: "Post" }],
  works: [{ type: Array, ref: "Work" }],
});

module.exports = model("Data", Data);
