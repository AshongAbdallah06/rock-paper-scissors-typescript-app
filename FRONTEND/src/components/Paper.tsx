import React, { FC, useEffect } from "react";
import paperIcon from "../images/icon-paper.svg";
import useCheckContext from "../hooks/useCheckContext";
import useFunctions from "../hooks/useFunctions";

interface Props {
	bonusState: boolean;
}
const Paper: FC<Props> = ({ bonusState }) => {
	const { moveOnclick, socket } = useCheckContext();
	const { sendMoveAck } = useFunctions();

	return (
		<div
			className={!bonusState ? "gameOpt" : "gameOpt-bonus"}
			onClick={() => {
				sendMoveAck(socket);
				moveOnclick("p");
			}}
		>
			<img
				src={paperIcon}
				alt="paper"
			/>
		</div>
	);
};

export default Paper;
