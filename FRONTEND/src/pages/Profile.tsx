import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import logo from "../images/logo.svg";
import dualIcon from "../images/people-outline-black.svg";
import profileIcon from "../images/person-circle-outline.svg";
import singleIcon from "../images/person-outline-black.svg";
import EditProfile from "./EditProfile";

const Profile = () => {
	const { currentUserStats, user, getUserStats } = useContextProvider();
	const [renderRoutes, setRenderRoutes] = useState<boolean>(false);
	const { allGamesPlayed, allLosses, allTies, allWins, getAllDualPlayerStats } = useFunctions();

	useEffect(() => {
		setRenderRoutes(false);
		const timer = setTimeout(() => {
			setRenderRoutes(true);
		}, 100);

		getAllDualPlayerStats(user?.username);
		getUserStats(user.username);

		return () => clearTimeout(timer);
	}, []);
	const [img, setImg] = useState<string | null>(user?.image || null);

	const [edit, setEdit] = useState<boolean>(false);
	const [newLocation, setNewLocation] = useState<string | null>(user?.location || "");
	const [newAge, setNewAge] = useState<number | null>(user?.age || null);
	const [newBio, setNewBio] = useState<string | null>(user?.bio || null);
	const [last_played, setLastPlayed] = useState<string | number | Date>(user?.bio || "");

	const [searchParams, setSearchParams] = useSearchParams("");

	useEffect(() => {
		if (!currentUserStats?.games_played) return;
		setLastPlayed(formatDistanceToNow(currentUserStats.last_played, { addSuffix: true }));
	}, [currentUserStats]);

	return (
		<>
			{renderRoutes && (
				<>
					<Link
						to="/"
						className="header"
					>
						<img
							src={logo}
							alt="logo"
						/>
					</Link>
					{!edit ? (
						<div className="profile-container">
							<div className="profile-header">
								<div className="image-container">
									<img
										src={img || profileIcon}
										alt="Profile"
										className="profile-pic"
									/>
								</div>

								<h3 className="profile-name">
									{user?.username},{" "}
									{newAge && <span className="age">{newAge}</span>}
								</h3>
								<p className="profile-location">{newLocation || "From Earth"}</p>
								<p className="profile-bio">
									{newBio ||
										"I’m a mysterious individual who has yet to fill out my bio. One thing’s for certain: I love to play rock-paper-scissors!"}
								</p>
								<p style={{ color: "#dc3545", fontWeight: "bold" }}>
									Last played: {last_played.toLocaleString()}
								</p>
							</div>

							<div className="profile-stats">
								<div className="stat-item">
									<img
										src={singleIcon}
										alt=""
									/>
									<p>Single</p>
								</div>
								<div className="stat-item">
									<h3>{currentUserStats?.games_played || 0}</h3>
									<p>Games Played</p>
								</div>
								<div className="stat-item">
									<h3>{currentUserStats?.wins || 0}</h3>
									<p>Wins</p>
								</div>
								<div className="stat-item">
									<h3>{currentUserStats?.losses || 0}</h3>
									<p>Losses</p>
								</div>
								<div className="stat-item">
									<h3>{currentUserStats?.ties || 0}</h3>
									<p>Ties</p>
								</div>
							</div>

							<div className="profile-stats">
								<div className="stat-item">
									<img
										src={dualIcon}
										alt=""
									/>
									<p>Dual</p>
								</div>
								<div className="stat-item">
									<h3>{allGamesPlayed ? allGamesPlayed : 0}</h3>
									<p>Games Played</p>
								</div>
								<div className="stat-item">
									<h3>{allWins ? allWins : 0}</h3>
									<p>Wins</p>
								</div>
								<div className="stat-item">
									<h3>{allLosses ? allLosses : 0}</h3>
									<p>Losses</p>
								</div>
								<div className="stat-item">
									<h3>{allTies ? allTies : 0}</h3>
									<p>Ties</p>
								</div>
							</div>

							<div className="profile-actions">
								<button
									className="edit-btn"
									onClick={() => {
										setEdit(true);
										setSearchParams((params) => ({
											...params,
											edit: edit ? false : true,
										}));
									}}
								>
									Edit Profile
								</button>
								<button className="challenge-btn">Logout</button>
							</div>
						</div>
					) : (
						<EditProfile
							setEdit={setEdit}
							img={img}
							setImg={setImg}
							newLocation={newLocation}
							newAge={newAge}
							newBio={newBio}
							setNewLocation={setNewLocation}
							setNewAge={setNewAge}
							setNewBio={setNewBio}
						/>
					)}
				</>
			)}
		</>
	);
};

export default Profile;
