import React from "react";
import useContextProvider from "../hooks/useContextProvider";
import LoadingDots from "./LoadingDots";

const MakingMove = () => {
	const { isOnePlayer } = useContextProvider();

	return (
		<h1 className="making-move">
			{isOnePlayer ? (
				<>
					The House is Making a Move
					<LoadingDots />
				</>
			) : (
				<>
					Processing Moves
					<LoadingDots />
				</>
			)}
		</h1>
	);
};

export default MakingMove;
