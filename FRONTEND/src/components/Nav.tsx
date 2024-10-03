import React, { FC, useEffect, useState } from "react";
import useCheckContext from "../hooks/useCheckContext";
import menuBar from "../images/menu-outline.svg";

interface Props {
	sidebarIsShowing: boolean;
	setSidebarIsShowing: (value: boolean) => void;
}

const Nav: FC<Props> = ({ setSidebarIsShowing }) => {
	const { roomID, socket, setLeftRoom, leftRoom } = useCheckContext();
	const [navIsShowing, setNavIsShowing] = useState(false);

	useEffect(() => {
		socket.on("leaveRoom", ({ msg }: { msg: string }) => {
			setLeftRoom(msg);

			setTimeout(() => {
				setLeftRoom("");
			}, 2000);
		});
	}, [roomID, socket, leftRoom]);

	return (
		<nav className="nav">
			<div
				className="menu-bar"
				onClick={() => {
					setNavIsShowing(!navIsShowing);
					setSidebarIsShowing(true);
				}}
			>
				<img
					src={menuBar}
					alt="messages"
					title="Menu"
				/>
			</div>
		</nav>
	);
};

export default Nav;
