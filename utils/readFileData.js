const fs = require("fs");
module.exports = function readFileData()  {
	try {
		const currentData = JSON.parse(fs.readFileSync("db.json", "utf8"));
		return currentData.data;
	} catch (err) {
		console.error(err);
		return [];
	}
}