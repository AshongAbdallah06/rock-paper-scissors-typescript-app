import React, { useEffect, useState } from "react";
import Dialog from "../components/Dialog";
import Chat from "../components/Chat";
import ScoreBoard from "../components/ScoreBoard";
import GameBoard from "../GameBoard";
import useCheckContext from "../hooks/useCheckContext";
import BonusDialog from "../components/bonus/Dialog";
import Nav from "../components/Nav";
import useFunctions from "../hooks/useFunctions";
import Footer from "../components/Footer";
import DualPlayerStats from "../components/DualPlayerStats";

const Home = () => {
	const [chatIsShowing, setChatIsShowing] = useState(false);
	const { isOnePlayer, moveAck, leftRoom, socket, user, setIsRulesModalShow } = useCheckContext();
	const { joinRoom } = useFunctions();

	useEffect(() => {
		localStorage.setItem("player-mode", JSON.stringify(isOnePlayer ? "single" : "dual"));
	}, [isOnePlayer]);

	const [showWhoLeft, setShowWhoLeft] = useState(false);

	const hasLeftRoom = leftRoom && leftRoom.includes("has left the room");
	useEffect(() => {
		setShowWhoLeft(true);

		setTimeout(() => {
			setShowWhoLeft(false);
		}, 2000);
	}, [hasLeftRoom]);

	const bonus = () => {
		const storedBonus = localStorage.getItem("bonus");
		try {
			return storedBonus ? JSON.parse(storedBonus) : null;
		} catch (error) {
			console.error("Error parsing selected user stats from localStorage:", error);
			return null; // Return null if parsing fails
		}
	};

	const [renderRoutes, setRenderRoutes] = useState(false);

	useEffect(() => {
		setRenderRoutes(false);
		const timer = setTimeout(() => {
			setRenderRoutes(true);
		}, 100);

		//fixme: Change any type
		socket.on("error-message", (msg: any) => {
			if (msg.error.includes("fk_username")) {
				localStorage.removeItem("user");
				window.location.href = "/login";
			}
		});

		if (isOnePlayer) {
			joinRoom(socket, user.username, bonusState);
		}

		if (!localStorage.getItem("bonus")) {
			localStorage.setItem("bonus", JSON.stringify(false));
		}

		return () => {
			socket.off("join-room");
			clearTimeout(timer);
		};
	}, []);

	const [sidebarIsShowing, setSidebarIsShowing] = useState<boolean>(false);
	const [bonusState, setBonusState] = useState<boolean>(!bonus ? false : true);
	const [showDualPlayerStats, setShowDualPlayerStats] = useState<boolean>(false);

	return (
		<>
			{renderRoutes && (
				<>
					{showDualPlayerStats && (
						<DualPlayerStats setShowDualPlayerStats={setShowDualPlayerStats} />
					)}
					<Nav
						sidebarIsShowing={sidebarIsShowing}
						setSidebarIsShowing={setSidebarIsShowing}
					/>

					{!isOnePlayer && moveAck && <p className="copied-alert">{moveAck}</p>}
					{!isOnePlayer && leftRoom && showWhoLeft && (
						<p className="copied-alert">{leftRoom}</p>
					)}

					<ScoreBoard />

					<GameBoard />

					{!bonusState ? <Dialog /> : <BonusDialog />}
					{chatIsShowing ? <Chat setChatIsShowing={setChatIsShowing} /> : ""}

					{sidebarIsShowing && (
						<Footer
							user={user}
							setSidebarIsShowing={setSidebarIsShowing}
							setChatIsShowing={setChatIsShowing}
							chatIsShowing={chatIsShowing}
							bonusState={bonusState}
							setBonusState={setBonusState}
							setShowDualPlayerStats={setShowDualPlayerStats}
						/>
					)}

					<button
						className="rules-btn"
						onClick={() => setIsRulesModalShow(true)}
					>
						RULES
					</button>
				</>
			)}
		</>
	);
};

export default Home;
