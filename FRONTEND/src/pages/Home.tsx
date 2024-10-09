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
import AlertComponent from "../components/AlertComponent";
import { MessageType } from "../Types";

const Home = () => {
	const [chatIsShowing, setChatIsShowing] = useState(false);
	const {
		isOnePlayer,
		moveAck,
		leftRoom,
		socket,
		user,
		setIsRulesModalShow,
		alertCounter,
		setAlertCounter,
		roomID,
	} = useCheckContext();
	const { joinRoom, getStorageItem } = useFunctions();

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

	const bonus = getStorageItem("bonus", null);

	const [renderRoutes, setRenderRoutes] = useState<boolean>(false);

	useEffect(() => {
		if (alertCounter === 0) {
			setAlertCounter(alertCounter + 1);
			alert(
				"Server takes a little time to respond; about a 50s to 1min. So you may want to reload the page to refetch score accurately."
			);
		}

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

	const [messages, setMessages] = useState(
		getStorageItem(`room-${roomID}-${user.username}-messages`, [])
	);

	useEffect(() => {
		localStorage.setItem(`room-${roomID}-${user.username}-messages`, JSON.stringify(messages));
	}, [messages]);

	useEffect(() => {
		socket.on("message", (message: MessageType) => {
			setMessages((prevMessages: MessageType[]) => [...prevMessages, message]);
			setShowMessageAlert(true);

			setTimeout(() => {
				setShowMessageAlert(false);
			}, 5000);
		});

		// Delete all messages
		socket.on("deleteMessage", () => {
			localStorage.removeItem(`room-${roomID}-${user.username}-messages`);
			setMessages([]);
		});

		return () => {
			socket.off("message");
		};
	}, [socket]);

	const [showMessageAlert, setShowMessageAlert] = useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem("alertCounter", JSON.stringify(alertCounter));
	}, [alertCounter]);

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
					{!isOnePlayer && showMessageAlert && (
						<AlertComponent
							message="New message. Click to view message."
							setChatIsShowing={setChatIsShowing}
							messages={messages}
						/>
					)}

					{!isOnePlayer && moveAck && <p className="alert">{moveAck}</p>}
					{!isOnePlayer && leftRoom && showWhoLeft && <p className="alert">{leftRoom}</p>}

					<ScoreBoard />

					<GameBoard />

					{!bonusState ? <Dialog /> : <BonusDialog />}
					{chatIsShowing ? (
						<Chat
							setMessages={setMessages}
							setChatIsShowing={setChatIsShowing}
							messages={messages}
						/>
					) : (
						""
					)}

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
