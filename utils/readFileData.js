const fs = require("fs");
const path = require("path");
module.exports = function readFileData() {
  try {
    const filePath = path.join(process.cwd(), "db.json");
    const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return currentData.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
