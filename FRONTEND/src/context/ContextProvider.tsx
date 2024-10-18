import React, { createContext, FC, useEffect, useState } from "react";
import io from "socket.io-client";
import Axios from "axios";
import useFunctions from "../hooks/useFunctions";
import {
	User,
	GameState,
	CurrentUserStats,
	DualPlayerStats,
	UserStats,
	Scores,
	Usernames,
	GetUserStatsData,
} from "../Types";
import { ContextType, Props } from "../Interfaces";

const socket = io("https://rock-paper-scissors-app-iybf.onrender.com");
// const socket = io("http://localhost:4001");

export const ContextProvider = createContext<ContextType | undefined>(undefined);

const Context: FC<Props> = ({ children }) => {
	const {
		checkPlayersMoves,
		checkOptions,
		playerMoveImage,
		setPlayerMoveImage,
		computerMoveImage,
		setComputerMoveImage,
		generateComputerMove,
		getAllScores,
		getStorageItem,
	} = useFunctions();

	const user: User = getStorageItem("user", null);
	const token: string = getStorageItem("token", null);
	const playerMode: string = getStorageItem("player-mode", null);

	const [isOnePlayer, setIsOnePlayer] = useState<boolean>(
		playerMode && playerMode === "dual" ? false : true
	);
	const [playerIsChosen, setPlayerIsChosen] = useState<boolean>(playerMode ? true : false);
	// When a player join a room
	const [roomIsSelected, setRoomIsSelected] = useState<boolean>(
		playerMode && playerMode === "single" ? true : false
	);

	// When a player leaves a room
	const [leftRoom, setLeftRoom] = useState<string | null>(null);
	const [gameState, setGameState] = useState<GameState>({ p1: null, p2: null, result: null });
	const [isRulesModalShow, setIsRulesModalShow] = useState<boolean>(false);
	// PlayerMove and ComputerMove are used as Player1 and Player2 in dual-mode respectively
	const [playerMove, setPlayerMove] = useState<string | null>(null);
	const [computerMove, setComputerMove] = useState<string | null>(null);
	const [result, setResult] = useState<string | null>(null);
	const [moveAck, setMoveAck] = useState<string | null | "">(null);
	const [roomID, setRoomID] = useState<string | null>(null);
	const [alertCounter, setAlertCounter] = useState<number>(getStorageItem("alertCounter", 0));

	const usernames: Usernames = getStorageItem("usernames", null);

	const [currentUserStats, setCurrentUserStats] = useState<CurrentUserStats | null>({
		score: 0,
		username: user?.username,
		gamesPlayed: 0,
		wins: 0,
		losses: 0,
		ties: 0,
		lastPlayed: null,
	});
	const [dualPlayerStats, setDualPlayerStats] = useState<DualPlayerStats | null>({
		player1_username: usernames?.p1Username,
		player1_wins: 0,
		player1_losses: 0,
		player2_username: usernames?.p2Username,
		player2_wins: 0,
		player2_losses: 0,
		ties: 0,
		games_played: 0,
	});
	const [selectedUserStats, setSelectedUserStats] = useState<UserStats>(
		getStorageItem("selectedUser", null)
	);
	const [p1Username, setP1Username] = useState<string | null>("");
	const [p2Username, setP2Username] = useState<string | null>("");
	const [userExists, setUserExists] = useState<boolean | undefined>(undefined);

	// Score on leaderboard
	const [scores, setScores] = useState<Scores | null>(null);
	const [errorOccurred, setErrorOccurred] = useState<string | null>(null);

	useEffect(() => {
		socket.on("move", (newGameState: GameState) => {
			setGameState(newGameState);
		});

		socket.on("move-made", ({ msg }: { msg: string }) => {
			setMoveAck(msg);
			setTimeout(() => {
				setMoveAck("");
			}, 3000);
		});

		socket.emit("getDualPlayerStats");

		socket.on("getDualPlayerStats", (data: DualPlayerStats[]) => {
			setDualPlayerStats(data[0]);
		});

		// Handle username updates
		socket.on("updateUsernames", (data: Usernames) => {
			!data?.p1Username && setP1Username(null);

			if (data?.p1Username && !data?.p2Username) {
				setP1Username(data?.p1Username);
				setP2Username(null);
			}
			if (data?.p1Username && data?.p2Username && data?.p1Username !== data?.p2Username) {
				setP1Username(data?.p1Username);
				setP2Username(data?.p2Username);

				getPlayerStats(data?.p1Username, data?.p2Username);
			}
		});

		// Cleanup on unmount
		return () => {
			socket.off("move");
			socket.off("getDualPlayerStats");
			socket.off("updateUsernames");

			socket.off("move-made");
		};
	}, [socket]);

	const [bonusState, setBonusState] = useState<boolean | "setting">(
		getStorageItem("bonus", false)
	);

	useEffect(() => {
		if (isOnePlayer) {
			checkOptions(
				playerMove,
				computerMove,
				setPlayerMoveImage,
				setComputerMoveImage,
				result,
				setResult,
				bonusState
			);
		}
	}, [playerMove, computerMove, isOnePlayer, result]);

	useEffect(() => {
		setPlayerMove(!isOnePlayer ? gameState.p1 : "");
		setComputerMove(!isOnePlayer ? gameState.p2 : "");
		setResult(!isOnePlayer ? gameState.result : "");

		!isOnePlayer && checkPlayersMoves(gameState, setPlayerMoveImage, setComputerMoveImage);
	}, [isOnePlayer, gameState.p1, gameState.p2]);

	const moveOnclick = (move: string) => {
		if (!isOnePlayer) {
			if (!playerMove) {
				setPlayerMove(move);
			} else if (!computerMove) {
				setComputerMove(move);
			}
			socket.emit("move", { username: user?.username, move });
		} else {
			setPlayerMove(move);
			generateComputerMove(setComputerMove, bonusState);
		}
	};

	const getUserStats = async (username: string) => {
		try {
			const res = await Axios.get(
				`https://rock-paper-scissors-app-iybf.onrender.com/api/user/stats/${username}`
				// `http://localhost:4001/api/user/stats/${username}`
			);

			const data: GetUserStatsData = res?.data[0] || {};

			if (username === user?.username) {
				setCurrentUserStats({
					...currentUserStats,
					score: data.score || 0,
					gamesPlayed: data.games_played || 0,
					lastPlayed: data.last_played,
					losses: data.losses || 0,
					ties: data.ties || 0,
					wins: data.wins || 0,
					username: user?.username,
				});
			} else {
				setSelectedUserStats(data);
			}
		} catch (error) {
			console.error("🚀 ~ getUserStats ~ error:", error);

			setErrorOccurred("Could not fetch user data.");
		}
	};

	useEffect(() => {
		if (!currentUserStats) {
			alert("No user present");
			return;
		}
		if (
			isOnePlayer &&
			currentUserStats.username === user?.username &&
			currentUserStats.gamesPlayed > 0
		) {
			socket.emit("updateStats", currentUserStats);
		}
	}, [currentUserStats, isOnePlayer]);

	const getPlayerStats = async (p1Username: string, p2Username: string) => {
		try {
			const res = await Axios.post(
				`https://rock-paper-scissors-app-iybf.onrender.com/api/user/stats`,
				// `http://localhost:4001/api/user/stats`,
				{
					p1Username,
					p2Username,
				}
			);

			const data = res?.data[0] || {};
			setDualPlayerStats(data);
		} catch (error) {
			console.error("🚀 ~ getUserStats ~ error:", error);

			setTimeout(() => {
				alert("Error occurred fetching player data. Try again later.");
			}, 5000);

			setErrorOccurred("Could not fetch user data.");
		}
	};

	useEffect(() => {
		if (isOnePlayer) {
			setCurrentUserStats((prevStats: CurrentUserStats | null) => {
				// let updatedStats = { ...prevStats };
				let updatedStats = {
					score: prevStats?.score || 0,
					username: user?.username || "",
					gamesPlayed: prevStats?.gamesPlayed || 0,
					wins: prevStats?.wins || 0,
					losses: prevStats?.losses || 0,
					ties: prevStats?.ties || 0,
					lastPlayed: prevStats?.lastPlayed || "",
				};

				if (result === "Tie") {
					updatedStats.ties = (updatedStats.ties || 0) + 1;
				} else if (result === "Player wins") {
					updatedStats.wins = (updatedStats.wins || 0) + 1;
				} else if (result === "Computer wins") {
					updatedStats.losses = (updatedStats.losses || 0) + 1;
				}

				updatedStats.gamesPlayed =
					(updatedStats.wins || 0) +
					(updatedStats.losses || 0) +
					(updatedStats.ties || 0);

				return updatedStats;
			});
		} else {
			setDualPlayerStats((prevStats: DualPlayerStats | null) => {
				let updatedDualPlayerStats = {
					player1_username: prevStats?.player1_username || "",
					player1_wins: prevStats?.player1_wins || 0,
					player1_losses: prevStats?.player1_losses || 0,
					player2_username: prevStats?.player2_username || "",
					player2_wins: prevStats?.player2_wins || 0,
					player2_losses: prevStats?.player2_losses || 0,
					ties: prevStats?.ties || 0,
					games_played: prevStats?.games_played || 0,
				};
				if (result === "Tie") {
					updatedDualPlayerStats.ties = (updatedDualPlayerStats.ties || 0) + 1;
				} else if (result === "Player1 wins") {
					updatedDualPlayerStats.player1_wins =
						(updatedDualPlayerStats.player1_wins || 0) + 1;
					updatedDualPlayerStats.player2_losses =
						(updatedDualPlayerStats.player2_losses || 0) + 1;
				} else if (result === "Player2 wins") {
					updatedDualPlayerStats.player2_wins =
						(updatedDualPlayerStats.player2_wins || 0) + 1;
					updatedDualPlayerStats.player1_losses =
						(updatedDualPlayerStats.player1_losses || 0) + 1;
				}

				updatedDualPlayerStats.games_played =
					(updatedDualPlayerStats.player1_wins || 0) +
					(updatedDualPlayerStats.player1_losses || 0) +
					(updatedDualPlayerStats.ties || 0);

				return updatedDualPlayerStats;
			});
		}
	}, [result, isOnePlayer]);

	useEffect(() => {
		if (!dualPlayerStats) return;

		if (dualPlayerStats?.games_played > 0) {
			socket.emit("updateDualPlayerStats", dualPlayerStats);
		}
	}, [dualPlayerStats]);

	useEffect(() => {
		socket.on("clearMoves", (newGameState: GameState) => {
			setGameState(newGameState);
		});

		return () => {
			socket.off("clearMoves");
		};
	}, [gameState]);

	const clearMoves = () => {
		socket.emit("clearMoves");
	};

	const authorize = async () => {
		try {
			await Axios.get(
				`https://rock-paper-scissors-app-iybf.onrender.com/api/user/${user?.username}`,
				// `http://localhost:4001/api/user/${user?.username}`,
				{
					headers: { Authorization: `Bearer ${user.token ? user.token : token}` },
				}
			);

			setUserExists(true);
		} catch (error) {
			setUserExists(false);
			console.log(error);
		}
	};

	useEffect(() => {
		getAllScores(socket, setScores);
	}, [socket, result, playerMove]);

	return (
		<ContextProvider.Provider
			value={{
				playerMove,
				computerMove,
				setPlayerMove,
				setComputerMove,
				result,
				setResult,
				playerMoveImage,
				computerMoveImage,
				socket,
				gameState,
				isOnePlayer,
				setIsOnePlayer,
				playerIsChosen,
				setPlayerIsChosen,
				roomID,
				setRoomID,
				roomIsSelected,
				setRoomIsSelected,
				clearMoves,
				authorize,
				userExists,
				setUserExists,
				isRulesModalShow,
				setIsRulesModalShow,
				moveOnclick,
				moveAck,
				setMoveAck,
				leftRoom,
				setLeftRoom,
				currentUserStats,
				setCurrentUserStats,
				scores,
				setScores,
				getUserStats,
				getPlayerStats,
				selectedUserStats,
				dualPlayerStats,
				errorOccurred,
				setErrorOccurred,
				p1Username,
				p2Username,
				user,
				bonusState,
				setBonusState,
				alertCounter,
				setAlertCounter,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
