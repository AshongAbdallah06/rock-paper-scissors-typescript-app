import React, { FC } from "react";
import spockIcon from "../../images/icon-spock.svg";
import useContextProvider from "../../hooks/useContextProvider";
import useFunctions from "../../hooks/useFunctions";

interface Props {
	bonusState: boolean;
}
const Spock: FC<Props> = ({ bonusState }) => {
	const { moveOnclick, socket } = useContextProvider();
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
