import { ReactNode } from "react";
import { CurrentUserStats, DualPlayerStats, GameState, Scores, User, UserStats } from "./Types";
import { Socket } from "socket.io-client";

export interface Props {
	children: ReactNode;
}

export interface ContextType {
	playerMove: string | null;
	computerMove: string | null;
	setPlayerMove: (move: string | null) => void;
	setComputerMove: (move: string | null) => void;
	result: string | null;
	setResult: (result: string | null) => void;
	playerMoveImage: string | null;
	computerMoveImage: string | null;
	socket: Socket;
	gameState: GameState;
	isOnePlayer: boolean;
	setIsOnePlayer: (value: boolean) => void;
	playerIsChosen: boolean;
	setPlayerIsChosen: (value: boolean) => void;
	roomID: string | null;
	setRoomID: (value: string | null) => void;
	roomIsSelected: boolean;
	setRoomIsSelected: (value: boolean) => void;
	clearMoves: () => void;
	authorize: () => void;
	userExists: boolean | undefined;
	setUserExists: (value: boolean) => void;
	isRulesModalShow: boolean;
	setIsRulesModalShow: (value: boolean) => void;
	moveOnclick: (move: string) => void;
	moveAck: string | null | "";
	setMoveAck: (value: string | null | "") => void;
	leftRoom: string | null;
	setLeftRoom: (value: string) => void;
	currentUserStats: CurrentUserStats | null;
	setCurrentUserStats: (value: CurrentUserStats) => void;
	scores: Scores | null;
	setScores: (value: Scores) => void;
	getUserStats: (username: string) => void;
	getPlayerStats: (p1Username: string, p2Username: string) => void;
	selectedUserStats: UserStats;
	dualPlayerStats: DualPlayerStats | null;
	errorOccurred: string | null;
	setErrorOccurred: (value: string) => void;
	p1Username: string | null;
	p2Username: string | null;
	user: User;
	bonusState: boolean | "setting";
	setBonusState: (value: boolean | "setting") => void;
	alertCounter: number;
	setAlertCounter: (value: number) => void;
}
