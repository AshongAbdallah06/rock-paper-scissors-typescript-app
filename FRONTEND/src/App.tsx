import { FC, useEffect, useState, ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import useCheckContext from "./hooks/useCheckContext";
import Login from "./pages/Login";
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

function PrivateRoute({
	userExists,
	children,
}: {
	userExists: boolean | undefined;
	children: ReactNode;
}) {
	return userExists ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({
	userExists,
	children,
}: {
	userExists: boolean | undefined;
	children: ReactNode;
}) {
	return userExists ? <Navigate to="/" /> : <>{children}</>;
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
		<>{children}</>
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
		<>{children}</>
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

	useEffect(() => {
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
