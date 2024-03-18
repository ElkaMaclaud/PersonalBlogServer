const fs = require("fs");
module.exports = function updateUser(user) {
	try {
		const currentData = JSON.parse(fs.readFileSync("db.json", "utf8"));
		console.lo
		const newUsers = currentData.users
			.map(currentUser => { if (currentUser.email === user.email) return { ...user }; return { ...currentUser } });
		currentData.users = newUsers
		fs.writeFileSync("db.json", JSON.stringify(currentData, null, 2), { encoding: "utf8", flag: "w" });
	} catch (err) {
		console.error(err);
	}
};