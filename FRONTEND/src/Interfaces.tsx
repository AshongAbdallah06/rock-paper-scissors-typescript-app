import { Dispatch, ReactNode, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { DualPlayerStats, GameState, Scores, User, UserStats } from "./Types";

export interface Props {
	children: ReactNode;
}

export interface ContextType {
	playerMove: string | null;
	computerMove: string | null;
	setPlayerMove: Dispatch<SetStateAction<string | null>>;
	setComputerMove: Dispatch<SetStateAction<string | null>>;
	result: string | null;
	setResult: Dispatch<SetStateAction<string | null>>;
	playerMoveImage: string | null;
	computerMoveImage: string | null;
	socket: Socket;
	gameState: GameState;
	isOnePlayer: boolean;
	setIsOnePlayer: Dispatch<SetStateAction<boolean>>;
	playerIsChosen: boolean;
	setPlayerIsChosen: Dispatch<SetStateAction<boolean>>;
	roomID: string | null;
	setRoomID: Dispatch<SetStateAction<string | null>>;
	roomIsSelected: boolean;
	setRoomIsSelected: Dispatch<SetStateAction<boolean>>;
	clearMoves: () => void;
	authorize: () => void;
	userExists: boolean | undefined;
	setUserExists: Dispatch<SetStateAction<boolean | undefined>>;
	isRulesModalShow: boolean;
	setIsRulesModalShow: Dispatch<SetStateAction<boolean>>;
	moveOnclick: (move: string) => void;
	moveAck: string | null | "";
	setMoveAck: Dispatch<SetStateAction<string | null | "">>;
	leftRoom: string | null;
	setLeftRoom: Dispatch<SetStateAction<string | null>>;
	currentUserStats: UserStats | null;
	setCurrentUserStats: Dispatch<SetStateAction<UserStats | null>>;
	scores: Scores | null;
	setScores: Dispatch<SetStateAction<Scores | null>>;
	getUserStats: (username: string) => void;
	getPlayerStats: (p1Username: string, p2Username: string) => void;
	selectedUserStats: UserStats;
	dualPlayerStats: DualPlayerStats | null;
	errorOccurred: string | null;
	setErrorOccurred: Dispatch<SetStateAction<string | null>>;
	p1Username: string | null;
	p2Username: string | null;
	user: User;
	bonusState: boolean | "setting";
	setBonusState: (value: boolean | "setting") => void;
	alertCounter: number;
	setAlertCounter: (value: number) => void;
}
