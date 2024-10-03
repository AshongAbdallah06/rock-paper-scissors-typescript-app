import React, { useEffect, useState } from "react";
import useCheckContext from "../hooks/useCheckContext";

type Rooms = string[] | null;

const AvailableRooms: React.FC = () => {
	const { socket } = useCheckContext();

	const [activeRooms, setActiveRooms] = useState<Rooms>(null);

	useEffect(() => {
		const handleActiveRooms = (active: { [key: string]: any }) => {
			if (active) {
				setActiveRooms(Object.keys(active));
			} else {
				setActiveRooms(null);
			}
		};

		socket.on("active-rooms", handleActiveRooms);

		// Cleanup function to remove the event listener
		return () => {
			socket.off("active-rooms", handleActiveRooms);
		};
	}, [socket]);

	return (
		<div className="room-container">
			<h1>Active Rooms</h1>
			{activeRooms ? (
				activeRooms.map((room) => (
					<div key={room}>
						<p className="name">{room}</p>
						<button>Join</button>
					</div>
				))
			) : (
				<p>No room available</p>
			)}
		</div>
	);
};

export default AvailableRooms;
