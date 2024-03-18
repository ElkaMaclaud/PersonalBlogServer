const fs = require("fs");
module.exports = function saveDataToFile(newUser) {
	try {
		const currentData = JSON.parse(fs.readFileSync("db.json", "utf8"));
		currentData.users.push(newUser);
		fs.writeFileSync("db.json", JSON.stringify(currentData, null, 2), { encoding: "utf8", flag: "w" });
	} catch (err) {
		console.error(err);
	}
};