import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const PlayerSelection = () => {
	const { setIsOnePlayer, setPlayerIsChosen, setRoomIsSelected } = useContextProvider();

	const [renderRoutes, setRenderRoutes] = useState<boolean>(false);

	useEffect(() => {
		setRenderRoutes(false);
		const timer = setTimeout(() => {
			setRenderRoutes(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{renderRoutes && (
				<>
					<div className="selection">
						<h1 style={{ fontSize: "3rem" }}>Welcome!</h1>

						<p>Please select a player mode</p>

						<div className="mode-links">
							<Link
								onClick={() => {
									setIsOnePlayer(false);
									setPlayerIsChosen(true);
								}}
								to="/select-room"
							>
								DUAL
							</Link>
							<Link
								onClick={() => {
									setIsOnePlayer(true);
									setPlayerIsChosen(true);
									setRoomIsSelected(true);
								}}
								to="/"
							>
								SINGLE
							</Link>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default PlayerSelection;
