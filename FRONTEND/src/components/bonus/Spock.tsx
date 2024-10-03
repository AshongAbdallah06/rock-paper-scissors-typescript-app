import React, { FC, useEffect } from "react";
import spockIcon from "../../images/icon-spock.svg";
import useCheckContext from "../../hooks/useCheckContext";
import useFunctions from "../../hooks/useFunctions";

interface Props {
	bonusState: boolean;
}
const Spock: FC<Props> = ({ bonusState }) => {
	const { moveOnclick, socket } = useCheckContext();
	const { sendMoveAck } = useFunctions();

	return (
		<div
			className={!bonusState ? "gameOpt" : "gameOpt-bonus"}
			onClick={() => {
				sendMoveAck(socket);
				moveOnclick("sp");
			}}
		>
			<img
				src={spockIcon}
				alt="spock"
			/>
		</div>
	);
};

export default Spock;
