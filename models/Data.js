const { Schema, model } = require("mongoose");

const Data = new Schema({
  resume: { type: Object, ref: "Resume" },
  posts: [{ type: Object, ref: "Post" }],
  works: [{ type: Object, ref: "Work" }],
});

module.exports = model("Data", Data);
