import React, { CSSProperties, FC, useEffect, useState } from "react";
import useCheckContext from "../hooks/useCheckContext";
import { Link, useSearchParams } from "react-router-dom";
import { Scores } from "../Types";

interface Props {
	optChanges: string | null;
}

const ScoresDisplay: FC<Props> = ({ optChanges }) => {
	const { scores, getUserStats, setScores, socket, user } = useCheckContext();

	const [searchParams, setSearchParams] = useSearchParams();

	const optChangesFunc = (socketName: string, query: string) => {
		socket.emit(socketName);
		setSearchParams((params) => ({ ...params, filter_query: query }));
	};

	const [scoresIsFetched, setScoresIsFetched] = useState(false);
	useEffect(() => {
		if (optChanges === "wins") {
			optChangesFunc("getScores", "wins");
		} else if (optChanges === "losses") {
			optChangesFunc("getScoresByLosses", "losses");
		} else if (optChanges === "ties") {
			optChangesFunc("getScoresByTies", "ties");
		} else if (optChanges === "games_played") {
			optChangesFunc("getScoresByGamesPlayed", "games_played");
		}

		setScoresIsFetched(false);
		setTimeout(() => {
			setScoresIsFetched(true);
		}, 2000);
	}, [optChanges]);

	useEffect(() => {
		socket.on("getAllScores", (scores: Scores) => {
			setScores(scores);
		});
		socket.on("getScoresByLosses", (scoresByLosses: Scores) => {
			setScores(scoresByLosses);
		});
		socket.on("getScoresByTies", (scoresByTies: Scores) => {
			setScores(scoresByTies);
		});
		socket.on("getScoresByGamesPlayed", (scoresByGamesPlayed: Scores) => {
			setScores(scoresByGamesPlayed);
		});
	}, [socket]);

	return (
		<ul className="scores-display">
			{!scoresIsFetched && (
				<div className="lds-spinner">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			)}

			{scoresIsFetched &&
				scores?.map((score) => (
					<Link
						to={`/p/${score?.username}`}
						title={score?.username}
						style={
							{
								textDecoration: "none",
								backgroundColor:
									user?.username === score?.username && "hsl(349, 70%, 56%)",
								color: user?.username === score?.username && "black",
							} as CSSProperties
						}
						className="user"
						key={score?.username}
						onClick={() => {
							getUserStats(score?.username);
						}}
					>
						<p
							style={{
								fontWeight: user?.username === score?.username ? "bold" : "normal",
							}}
						>
							{score?.username === user?.username ? "You" : score?.username}
						</p>
						<span style={{ color: "orange" }}>
							{optChanges === "wins" && score?.wins}
							{optChanges === "losses" && score?.losses}
							{optChanges === "ties" && score?.ties}
							{optChanges === "games_played" && score?.games_played}
						</span>

						{/* WinsPercentage */}
						{(!optChanges || optChanges) === "wins" && (
							<span style={{ color: "orange" }}>
								{score?.wins !== 0 && score?.games_played !== 0
									? ((score?.wins / score?.games_played) * 100).toFixed(2)
									: 0}
								%
							</span>
						)}

						{/* LossesPercentage */}
						{optChanges === "losses" && (
							<span style={{ color: "orange" }}>
								{score?.losses !== 0 && score?.games_played !== 0
									? ((score?.losses / score?.games_played) * 100).toFixed(2)
									: 0}
								%
							</span>
						)}

						{/* TiesPercentage */}
						{optChanges === "ties" && (
							<span style={{ color: "orange" }}>
								{score?.ties !== 0 && score?.games_played !== 0
									? ((score?.ties / score?.games_played) * 100).toFixed(2)
									: 0}
								%
							</span>
						)}

						{/* GamesPlayedPercentage */}
						{optChanges === "games_played" && (
							<span style={{ color: "orange" }}>
								{score?.games_played !== 0 && score?.games_played !== 0
									? ((score?.games_played / score?.games_played) * 100).toFixed(2)
									: 0}
								%
							</span>
						)}
					</Link>
				))}
		</ul>
	);
};

export default ScoresDisplay;
