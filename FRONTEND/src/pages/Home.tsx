import { useEffect, useRef, useState } from "react";
import AlertComponent from "../components/AlertComponent";
import BonusDialog from "../components/bonus/Dialog";
import ChangeMode from "../components/ChangeMode";
import Chat from "../components/Chat";
import Dialog from "../components/Dialog";
import DualPlayerStats from "../components/DualPlayerStats";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import ScoreBoard from "../components/ScoreBoard";
import SuccessAlert from "../components/SuccessAlert";
import GameBoard from "../GameBoard";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import { MessageType } from "../Types";

const Home = () => {
	const [chatIsShowing, setChatIsShowing] = useState<boolean>(false);
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
		bonusState,
		setComputerMove,
		setPlayerMove,
	} = useContextProvider();
	const { getStorageItem, generateRandomMove } = useFunctions();

	useEffect(() => {
		localStorage.setItem("player-mode", JSON.stringify(isOnePlayer ? "single" : "dual"));
	}, [isOnePlayer]);

	const [showWhoLeft, setShowWhoLeft] = useState<boolean>(false);

	const hasLeftRoom = leftRoom && leftRoom.includes("has left the room");
	useEffect(() => {
		setShowWhoLeft(true);

		setTimeout(() => {
			setShowWhoLeft(false);
		}, 2000);
	}, [hasLeftRoom]);

	const [renderRoutes, setRenderRoutes] = useState<boolean>(false);

	useEffect(() => {
		if (alertCounter === 0) {
			setAlertCounter(alertCounter + 1);
			alert(
				"Server may take a little time to respond; about a 50s to 1min. You may want to reload the page after 50s to refetch score accurately."
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

		if (!localStorage.getItem("bonus")) {
			localStorage.setItem("bonus", JSON.stringify(false));
		}

		return () => {
			socket.off("join-room");
			clearTimeout(timer);
		};
	}, []);

	const [messages, setMessages] = useState<MessageType[]>(
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

		return () => {
			socket.off("message");
		};
	}, [socket]);

	const [showMessageAlert, setShowMessageAlert] = useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem("alertCounter", JSON.stringify(alertCounter));
	}, [alertCounter]);

	const [sidebarIsShowing, setSidebarIsShowing] = useState<boolean>(false);
	const [showDualPlayerStats, setShowDualPlayerStats] = useState<boolean>(false);
	const [showChangeModePopup, setShowChangeModePopup] = useState<boolean>(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [showAutoPlayMessage, setShowAutoPlayMessage] = useState<boolean>(false);
	const [startAutoPlay, setStartAutoPlay] = useState<boolean>(false);
	function autoPlay() {
		if (startAutoPlay === false) {
			setStartAutoPlay(true);
			setShowAutoPlayMessage(true);

			intervalRef.current = setInterval(() => {
				generateRandomMove(setPlayerMove, bonusState);
				generateRandomMove(setComputerMove, bonusState);
			}, 4000);
		} else {
			if (intervalRef.current) {
				setStartAutoPlay(false);
				clearInterval(intervalRef.current);
			}
		}

		setTimeout(() => {
			setShowAutoPlayMessage(false);
		}, 4000);
	}

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
					{!isOnePlayer && showMessageAlert && !chatIsShowing && (
						<AlertComponent
							message="You have a new message"
							message1="Click here to view."
							setChatIsShowing={setChatIsShowing}
							messages={messages}
						/>
					)}

					{!isOnePlayer && moveAck && <p className="alert">{moveAck}</p>}
					{!isOnePlayer && leftRoom && showWhoLeft && <p className="alert">{leftRoom}</p>}

					<ScoreBoard />

					<GameBoard />

					{showChangeModePopup && (
						<ChangeMode
							setShowChangeModePopup={setShowChangeModePopup}
							setSidebarIsShowing={setSidebarIsShowing}
						/>
					)}
					{!bonusState ? <Dialog /> : <BonusDialog />}
					{chatIsShowing && (
						<Chat
							setMessages={setMessages}
							setChatIsShowing={setChatIsShowing}
							messages={messages}
							setShowMessageAlert={setShowMessageAlert}
						/>
					)}

					{sidebarIsShowing && (
						<Footer
							user={user}
							setSidebarIsShowing={setSidebarIsShowing}
							setChatIsShowing={setChatIsShowing}
							chatIsShowing={chatIsShowing}
							setShowDualPlayerStats={setShowDualPlayerStats}
							setShowChangeModePopup={setShowChangeModePopup}
						/>
					)}

					{showAutoPlayMessage && (
						<SuccessAlert
							successTitle="Wait a minute"
							successDescription="Starting autoplay..."
						/>
					)}

					<div className="actions">
						<button
							className={`play-btn ${startAutoPlay && "stop"} `}
							onClick={autoPlay}
						>
							{!startAutoPlay ? "Play" : "Stop"}
						</button>

						<button
							className="rules-btn"
							onClick={() => setIsRulesModalShow(true)}
						>
							RULES
						</button>
					</div>
				</>
			)}
		</>
	);
};

export default Home;
