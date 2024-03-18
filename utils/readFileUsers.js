const fs = require("fs");
module.exports = function readFileUsers() {
	try {
		const filePath = path.join(process.cwd(), "data.json");
		const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
		return currentData.users;
	} catch (err) {
		console.error(err);
		return [];
	}
}