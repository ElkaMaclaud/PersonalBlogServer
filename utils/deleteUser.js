const fs = require("fs");
module.exports = function deleteUser(user) {
	try {
		const currentUsers = JSON.parse(fs.readFileSync("db.json", "utf8"));
		const index = currentUsers.users.findIndex(u => u.email === user.email);
		currentUsers.users.splice(index, 1)
		fs.writeFileSync("db.json", JSON.stringify(currentUsers, null, 2), { encoding: "utf8", flag: "w" });
	} catch (err) {
		console.error(err);
	}
};