import React, { FC, useEffect } from "react";
import scissorsIcon from "../images/icon-scissors.svg";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

interface Props {
	bonusState: boolean;
}
const Scissors: FC<Props> = ({ bonusState }) => {
	const { moveOnclick, socket } = useContextProvider();
	const { sendMoveAck } = useFunctions();

	return (
		<div
			className={!bonusState ? "gameOpt" : "gameOpt-bonus"}
			onClick={() => {
				sendMoveAck(socket);
				moveOnclick("s");
			}}
		>
			<img
				src={scissorsIcon}
				alt="scissors"
			/>
		</div>
	);
};

export default Scissors;
