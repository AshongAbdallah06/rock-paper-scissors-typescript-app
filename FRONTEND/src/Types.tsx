export type User = {
	username: string;
	email: string | null;
	age: number;
	bio: string | null;
	image: string | null;
	location: string | null;
	token: string | null;
};

export type OpponentInfo = Omit<User, "token">;

export type GameState = {
	p1: string | null;
	p2: string | null;
	result: string | null;
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
	username: string;
	games_played: number;
	wins: number;
	losses: number;
	ties: number;
	last_played: string | number | Date;
};

export type Scores = UserStats[];

export type Usernames = {
	p1Username: string | null;
	p2Username: string | null;
};

export type MessageType = { username: string; textMessage: string };
