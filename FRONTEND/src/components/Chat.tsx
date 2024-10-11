import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import closeIcon from "../images/icon-close-chat.svg";
import useCheckContext from "../hooks/useCheckContext";
import trashCan from "../images/trash-outline.svg";

interface Props {
	setChatIsShowing: (value: boolean) => void;
	messages: Message[];
	setMessages: (value: Message[]) => void;
}

type Message = { username: string; textMessage: string };

const Chat: FC<Props> = ({ setChatIsShowing, messages, setMessages }) => {
	const { socket, roomID, user, p1Username, p2Username } = useCheckContext();

	const [textMessage, setTextMessage] = useState<string>("");

	const messagesEndRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		setTimeout(() => {
			setChatIsFetched(true);
		}, 2000);
	}, []);
	useEffect(() => {
		localStorage.setItem(`room-${roomID}-${user.username}-messages`, JSON.stringify(messages));

		// Scroll to bottom
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = () => {
		socket.emit("message", { username: user.username, textMessage });

		setTextMessage("");
	};

	const deleteChat = () => {
		socket.emit("deleteMessage");
		localStorage.removeItem(`room-${roomID}-${user.username}-messages`);
		setMessages([]);
	};
	const [chatIsFetched, setChatIsFetched] = useState(false);

	return (
		<aside>
			<div className="content">
				<header>
					<h1>Live Chat</h1>
					<img
						src={closeIcon}
						alt="close-icon"
						className="close-icon"
						onClick={() => {
							setChatIsShowing(false);
						}}
					/>
				</header>

				<div
					className="header2"
					style={{ fontSize: "0.8rem" }}
				>
					<p>Have a conversation with your opponent</p>
					<button
						className="delete"
						title="Delete Chat"
						onClick={deleteChat}
					>
						<img
							src={trashCan}
							alt="Delete Chat"
							className="trash"
						/>
					</button>
				</div>

				{chatIsFetched && (
					<>
						<div className="chat-container">
							{p1Username && p2Username ? (
								<>
									<div className="messages">
										{messages.map((message: Message, index: number) => (
											<div
												className={`person ${
													message?.username === user?.username
														? "you"
														: "other"
												}`}
												key={index}
											>
												<p className="username">
													<span
														className="name"
														style={{
															textTransform: "capitalize",
															fontWeight: "normal",
														}}
													>
														{message?.username === user.username
															? "You"
															: message?.username}
													</span>
												</p>
												<p className="message">{message.textMessage}</p>
												<div ref={messagesEndRef} />
											</div>
										))}
									</div>

									<div className="input-container">
										<textarea
											value={textMessage}
											placeholder="Enter text message"
											onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
												setTextMessage(e.target.value);
											}}
										></textarea>
										<button
											onClick={() => {
												textMessage !== "" && sendMessage();
											}}
										>
											Send
										</button>
									</div>
								</>
							) : (
								<div className="messages left">Your Opponent left</div>
							)}
						</div>
					</>
				)}
				{!chatIsFetched && (
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
			</div>
		</aside>
	);
};

export default Chat;
