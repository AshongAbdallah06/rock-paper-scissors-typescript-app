import { FC, useEffect, useState } from "react";
import useCheckContext from "../hooks/useCheckContext";

type Message = { username: string; textMessage: string };

interface Props {
	message: string;
	message1: string;
	setChatIsShowing: (value: boolean) => void;
	messages?: Message[];
}

const AlertComponent: FC<Props> = ({ message, message1, setChatIsShowing, messages }) => {
	const { user } = useCheckContext();
	const [isNotificationAlert, setIsNotificationAlert] = useState<boolean>(false);
	const [isEqual, setIsEqual] = useState<boolean>(false);

	useEffect(() => {
		if (message === "You have a new message") {
			setIsNotificationAlert(true);

			if (messages) {
				messages[messages.length - 1]?.username === user.username
					? setIsEqual(true)
					: setIsEqual(false);
			}
		}
	}, [messages]);

	return (
		<>
			{!isNotificationAlert ? (
				<div className="alert">{message}</div>
			) : (
				!isEqual && (
					<div
						className="message-alert"
						onClick={() => setChatIsShowing(true)}
					>
						{message} <br />
						{message1}
					</div>
				)
			)}
		</>
	);
};

export default AlertComponent;
