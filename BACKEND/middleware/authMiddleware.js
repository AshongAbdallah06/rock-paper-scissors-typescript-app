const jwt = require("jsonwebtoken");
const pool = require("../db");

const requireAuth = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		res.status(400).json({ error: "Authorization token required" });
	}

	const token = authorization.split(" ")[1];

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const result = await pool.query("SELECT ID FROM users WHERE ID = $1", [id]);
		const user = result.rows[0].id;

		req.user = user;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: "Request not authorized" });
	}
};

module.exports = { requireAuth };
