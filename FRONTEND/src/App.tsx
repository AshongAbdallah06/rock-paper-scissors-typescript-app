import "./styles/Animation.css";
import "./styles/Home.css";
import "./styles/Leaderboard.css";
import "./styles/Profile.css";
import "./styles/Help.css";
import "./styles/Mobile.css";
import "./styles/Chat.css";
import "./styles/Sidebar.css";
import "./styles/Room.css";
import "./styles/Form.css";
import { FC, useEffect, useState } from "react";
import useCheckContext from "./hooks/useCheckContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { ReactNode } from "react";
import Signup from "./pages/Signup";
import PlayerSelection from "./pages/PlayerSelection";
import Room from "./pages/Room";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import PlayerProfile from "./pages/PlayerProfile";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import Logo from "./components/Logo";
import Help from "./pages/Help";
import Axios from "axios";
import Contact from "./pages/Contact";
import AvailableRooms from "./components/AvailableRooms";
import EditProfile from "./pages/EditProfile";

// export const GameContext = createContext();

function PrivateRoute({
	userExists,
	children,
}: {
	userExists: boolean | undefined;
	children: ReactNode;
}) {
	return userExists ? children : <Navigate to="/login" />;
}

function PublicRoute({
	userExists,
	children,
}: {
	userExists: boolean | undefined;
	children: ReactNode;
}) {
	return userExists ? <Navigate to="/" /> : children;
}

interface LoadingProps {
	isRendered: boolean;
	setIsRendered: (isRendered: boolean) => void;
	children: ReactNode;
}

interface LoadingAppProps {
	isAppRendered: boolean;
	setIsAppRendered: (isAppRendered: boolean) => void;
	children: ReactNode;
}

const Loading: FC<LoadingProps> = ({ isRendered, setIsRendered, children }) => {
	const location = useLocation();

	useEffect(() => {
		setIsRendered(false);

		const timer = setTimeout(() => {
			setIsRendered(true);
		}, 2000);

		return () => clearTimeout(timer);
	}, [location.pathname]);

	return isRendered ? (
		children
	) : (
		<>
			<Logo />
			<Loader />
		</>
	);
};

const LoadingApp: FC<LoadingAppProps> = ({ isAppRendered, setIsAppRendered, children }) => {
	useEffect(() => {
		setIsAppRendered(false);

		const timer = setTimeout(() => {
			setIsAppRendered(true);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return isAppRendered ? (
		children
	) : (
		<>
			<Logo />
			<Loader />
		</>
	);
};

const App: FC = () => {
	const { playerIsChosen, roomIsSelected, userExists, isOnePlayer, user, authorize } =
		useCheckContext();
	const [isRendered, setIsRendered] = useState<boolean>(false);
	const [isAppRendered, setIsAppRendered] = useState<boolean>(false);

	/**
	 	All todo:
		Create an invite template that users can share in two player mode(maybe also in single player)
		Create Invite a friend button
	 * 	- Interactive Tutorials: Create a tutorial mode to help new players learn the game.
	 * 	- Statistics Tracking: Provide detailed stats, such as win/loss ratio, most picked moves, streaks(wins, losses, ties), etc.
	 * 	- todo: Remove chat popup when an empty space is clicked <------ Next todo:
	 		- Create feature where players are allowed to play the game even when they are not logged in, and remind them that scores will not be saved 
				- Will be lost when page is refreshed
				- Cant view profile, leaderboard
				- Cant play bonus or dual mode

				fixme: when in home(dual): players should not be able to change game type until they leave
				Fix leaveRoom function
				type socket function parameters
	 */

	const [isServerOk, setIsServerOk] = useState<boolean>(true);
	const startServer = async () => {
		try {
			const res = await Axios.get(
				`https://rock-paper-scissors-app-iybf.onrender.com/api/user/${user?.username}`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);

			if (res.data) setIsServerOk(true);
		} catch (error) {
			setIsServerOk(false);
			console.log(error);
			alert("Error Occurred. Check the console to see what occurred.");
		}
	};
	useEffect(() => {
		// startServer();
		authorize();
	}, []);

	return (
		<>
			<LoadingApp
				isAppRendered={isAppRendered}
				setIsAppRendered={setIsAppRendered}
			>
				<Routes>
					<Route
						path="/"
						element={
							<PrivateRoute userExists={userExists}>
								{playerIsChosen ? (
									roomIsSelected ? (
										<>
											<Loading
												isRendered={isRendered}
												setIsRendered={setIsRendered}
											>
												<Home />
											</Loading>
										</>
									) : (
										<Navigate to="/select-room" />
									)
								) : (
									<Navigate to="/select-player-mode" />
								)}
							</PrivateRoute>
						}
					/>

					<Route
						path="/select-player-mode"
						element={
							<PrivateRoute userExists={userExists}>
								<Loading
									isRendered={isRendered}
									setIsRendered={setIsRendered}
								>
									<PlayerSelection />
								</Loading>
							</PrivateRoute>
						}
					/>

					<Route
						path="/select-room"
						element={
							<PrivateRoute userExists={userExists}>
								<Logo />

								{!isOnePlayer ? <Room /> : <Navigate to="/" />}
							</PrivateRoute>
						}
					/>

					<Route
						path="/available-rooms"
						element={
							<PrivateRoute userExists={userExists}>
								<Logo />

								<AvailableRooms />
							</PrivateRoute>
						}
					/>

					<Route
						path="/leaderboard"
						element={
							<PrivateRoute userExists={userExists}>
								<Loading
									isRendered={isRendered}
									setIsRendered={setIsRendered}
								>
									{isOnePlayer ? <Leaderboard /> : <Navigate to="/" />}
								</Loading>
							</PrivateRoute>
						}
					/>

					<Route
						path={"/help"}
						element={
							<PrivateRoute userExists={userExists}>
								<Loading
									isRendered={isRendered}
									setIsRendered={setIsRendered}
								>
									<Help />
								</Loading>
							</PrivateRoute>
						}
					/>

					{/* <Route
						path={"/help/contact"}
						element={
							<PrivateRoute userExists={userExists}>
								<Loading
									isRendered={isRendered}
									setIsRendered={setIsRendered}
								>
									<Contact />
								</Loading>
							</PrivateRoute>
						}
					/> */}

					<Route
						path={`/p/${user?.username}`}
						element={
							<PrivateRoute userExists={userExists}>
								<Loading
									isRendered={isRendered}
									setIsRendered={setIsRendered}
								>
									<Profile />
								</Loading>
							</PrivateRoute>
						}
					/>
					{/* 
					<Route
						path="/edit/profile"
						element={
							<PrivateRoute userExists={userExists}>
								<Loading
									isRendered={isRendered}
									setIsRendered={setIsRendered}
								>
									<EditProfile />
								</Loading>
							</PrivateRoute>
						}
					/> */}

					{isOnePlayer && (
						<Route
							path="/p/:username"
							element={
								<PrivateRoute userExists={userExists}>
									<Loading
										isRendered={isRendered}
										setIsRendered={setIsRendered}
									>
										<PlayerProfile />
									</Loading>
								</PrivateRoute>
							}
						/>
					)}

					<Route
						path="/login"
						element={
							<PublicRoute userExists={userExists}>
								<Login />
							</PublicRoute>
						}
					/>

					<Route
						path="/signup"
						element={
							<PublicRoute userExists={userExists}>
								<Signup />
							</PublicRoute>
						}
					/>

					<Route
						path="*"
						element={
							<Loading
								isRendered={isRendered}
								setIsRendered={setIsRendered}
							>
								<NotFound />
							</Loading>
						}
					/>
				</Routes>
			</LoadingApp>
		</>
	);
};

export default App;
