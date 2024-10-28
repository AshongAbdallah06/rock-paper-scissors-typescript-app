export type User = {
	age: number;
	bio: string | null;
	email: string | null;
	image: string | null;
	location: string | null;
	token: string | null;
	username: string;
};
export type OpponentInfo = {
	age: number;
	bio: string | null;
	email: string | null;
	image: string | null;
	location: string | null;
};
export type GameState = {
	p1: string | null;
	p2: string | null;
	result: string | null;
};
export type CurrentUserStats = {
	score: number;
	username: string;
	gamesPlayed: number;
	wins: number;
	losses: number;
	ties: number;
	lastPlayed: string | number | Date;
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
	score: number;
	ties: number;
	username: string;
	wins: number;
};

export type Scores = UserStats[];
export type Usernames = {
	p1Username: string | null;
	p2Username: string | null;
};

export type GetUserStatsData = {
	score: number;
	games_played: number;
	last_played: string | number | Date;
	losses: number;
	ties: number;
	wins: number;
	username: string;
};
export type MessageType = { username: string; textMessage: string };
