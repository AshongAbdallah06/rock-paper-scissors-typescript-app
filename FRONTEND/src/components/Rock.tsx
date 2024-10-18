import React, { FC, useEffect } from "react";
import rockIcon from "../images/icon-rock.svg";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

interface Props {
	bonusState: boolean;
}
const Rock: FC<Props> = ({ bonusState }) => {
	const { moveOnclick, socket } = useContextProvider();
	const { sendMoveAck } = useFunctions();

	return (
		<div
			className={!bonusState ? "gameOpt" : "gameOpt-bonus"}
			onClick={() => {
				sendMoveAck(socket);
				moveOnclick("r");
			}}
		>
			<img
				src={rockIcon}
				alt="rock"
			/>
		</div>
	);
};

export default Rock;
