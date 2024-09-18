const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({
  title: String,
  content: Buffer,
  date: { type: Date, default: Date.now }
  });
  
  module.exports = model('Image', ImageSchema);
