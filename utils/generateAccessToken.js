const { secret } = require("../config")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

module.exports = function generateAccessToken (id, email)  {
	const payload = {
		id,
		email
	}
	return jwt.sign(payload, process.env.SECRET, { expiresIn: "24h" })
}