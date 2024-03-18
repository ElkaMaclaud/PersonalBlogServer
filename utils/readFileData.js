const fs = require("fs");
module.exports = function readFileData()  {
	try {
		const filePath = path.join(process.cwd(), "data.json");
		const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
		return currentData.data;
	} catch (err) {
		console.error(err);
		return [];
	}
}