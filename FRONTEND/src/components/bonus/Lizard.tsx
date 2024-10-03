import React, { FC, useEffect } from "react";
import lizardIcon from "../../images/icon-lizard.svg";
import useCheckContext from "../../hooks/useCheckContext";
import useFunctions from "../../hooks/useFunctions";

interface Props {
	bonusState: boolean;
}
const Lizard: FC<Props> = ({ bonusState }) => {
	const { moveOnclick, socket } = useCheckContext();
	const { sendMoveAck } = useFunctions();

	return (
		<div
			className={!bonusState ? "gameOpt" : "gameOpt-bonus"}
			onClick={() => {
				sendMoveAck(socket);
				moveOnclick("l");
			}}
		>
			<img
				src={lizardIcon}
				alt="lizard"
			/>
		</div>
	);
};

export default Lizard;
