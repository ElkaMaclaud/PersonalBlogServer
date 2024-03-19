const fs = require("fs");
const path = require("path");
module.exports = function deleteUser(user) {
  try {
    const filePath = path.join(process.cwd(), "db.json");
    const currentUsers = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const index = currentUsers.users.findIndex((u) => u.email === user.email);
    currentUsers.users.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(currentUsers, null, 2), {
      encoding: "utf8",
      flag: "w",
    });
  } catch (err) {
    console.error(err);
  }
};
