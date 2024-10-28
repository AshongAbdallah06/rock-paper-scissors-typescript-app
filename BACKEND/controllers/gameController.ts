const pool = require("../db");
import { Request, Response } from "express";
import { QueryResult } from "pg";
import { DualPlayerStats, GetUserId, UserInterface, UserStats } from "../Types";

const getHome = async (req: GetUserId, res: Response) => {
	try {
		const userInfoDetails: QueryResult<UserInterface> = await pool.query(
			"SELECT * FROM USERS WHERE ID = $1",
			[req.user]
		);

		if (userInfoDetails!.rowCount! > 0) res.status(201).json({ msg: "ok" });
	} catch (error) {
		res.status(401).json(error);
	}
};

const getUserStats = async (req: Request, res: Response) => {
	const { username } = req.params;

	try {
		const response: QueryResult<UserStats> = await pool.query(
			"SELECT * FROM SCORES WHERE USERNAME = $1",
			[username]
		);

		res.status(201).json(response.rows);
	} catch (error) {
		console.log("🚀 ~ getUserStats ~ error:", error);
	}
};

const getPlayerStats = async (req: Request, res: Response) => {
	const { p1Username, p2Username } = req.body;

	try {
		const response: QueryResult<DualPlayerStats> = await pool.query(
			"SELECT * FROM DUAL_PLAYER_SCORES WHERE (PLAYER1_USERNAME = $1 AND PLAYER2_USERNAME = $2) OR (PLAYER1_USERNAME = $2 AND PLAYER2_USERNAME = $1)",
			[p1Username, p2Username]
		);

		res.status(201).json(response.rows);
	} catch (error) {
		console.log("🚀 ~ getUserStats ~ error:", error);

		return;
	}
};

const getUserDualPlayerStats = async (req: Request, res: Response) => {
	const { username } = req.params;

	try {
		const response: QueryResult<DualPlayerStats> = await pool.query(
			"SELECT * FROM DUAL_PLAYER_SCORES WHERE PLAYER1_USERNAME = $1 OR PLAYER2_USERNAME = $1",
			[username]
		);

		res.status(201).json(response.rows);
	} catch (error) {
		console.log("🚀 ~ getUserStats ~ error:", error);

		return;
	}
};

module.exports = { getHome, getUserStats, getPlayerStats, getUserDualPlayerStats };
