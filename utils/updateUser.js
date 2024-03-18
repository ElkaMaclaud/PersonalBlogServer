const fs = require("fs");
const path = require("path");
module.exports = function updateUser(user) {
	try {
		const filePath = path.join(process.cwd(), "data.json");
		const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
		console.lo
		const newUsers = currentData.users
			.map(currentUser => { if (currentUser.email === user.email) return { ...user }; return { ...currentUser } });
		currentData.users = newUsers
		fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), { encoding: "utf8", flag: "w" });
	} catch (err) {
		console.error(err);
	}
};