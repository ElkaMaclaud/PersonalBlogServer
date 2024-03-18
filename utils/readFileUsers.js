const fs = require("fs");
module.exports = function readFileUsers() {
	try {
		const currentData = JSON.parse(fs.readFileSync("db.json", "utf8"));
		return currentData.users;
	} catch (err) {
		console.error(err);
		return [];
	}
}