const jwt = require("jsonwebtoken");
const pool = require("../db");
import { Request, Response, NextFunction } from "express";
import { GetUserId } from "../Types";

export const requireAuth = async (req: GetUserId, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	// Check if the authorization header is present
	if (!authorization) {
		return res.status(400).json({ error: "Authorization token required" });
	}

	const token = authorization.split(" ")[1];

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY) as { id: string };
		const result = await pool.query("SELECT ID FROM users WHERE ID = $1", [id]);

		if (result.rowCount === 0) {
			return res.status(401).json({ error: "User not found" });
		}

		const user = result.rows[0].id;

		req.user = user;

		next();
	} catch (error) {
		console.error("JWT Verification Error:", error);
		return res.status(401).json({ error: "Request not authorized" });
	}
};

// module.exports =  requireAuth ;
