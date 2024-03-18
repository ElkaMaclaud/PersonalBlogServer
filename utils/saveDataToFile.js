const fs = require("fs");
const path = require("path");
module.exports = function saveDataToFile(newUser) {
	try {
		const filePath = path.join(process.cwd(), "data.json");
		const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
		currentData.users.push(newUser);
		fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), { encoding: "utf8", flag: "w" });
	} catch (err) {
		console.error(err);
	}
};