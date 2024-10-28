import { Request } from "express";
export interface GetUserId extends Request {
	user: UserInterface;
}

export type UserInterface = {
	id: string;
	password: string;
	age: number;
	bio: string | null;
	email: string;
	image: string | null;
	location: string | null;
	username: string;
};

export type DualPlayerStats = {
	player1_username: string | null;
	player1_wins: number;
	player1_losses: number;
	player2_username: string | null;
	player2_wins: number;
	player2_losses: number;
	ties: number;
	games_played: number;
};

export type UserStats = {
	games_played: number;
	last_played: string | number | Date;
	losses: number;
	ties: number;
	username: string;
	wins: number;
};

export type MessageType = { username: string; textMessage: string };

export type Move = { username: string; move: "r" | "p" | "s" | "sp" | "l" };

export type GameRooms = { [key: string]: { p1_ID: null | string; p2_ID: null | string } };

export type GameResult = {
	[key: string]: {
		p1: null | string;
		p2: null | string;
		result: "Tie" | "Player2 wins" | "Player1 wins" | null;
	};
};

export type Usernames = {
	[key: string]: {
		p1Username: string | null;
		p2Username: string | null;
	};
};
export type CorsCallback = (error: Error | null, success: boolean) => void;
