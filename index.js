const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://elkamaclaud:62sH5glEwMjvCJr5@cluster0.9bh0b0z.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
    );
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
