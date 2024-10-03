import React, { ChangeEvent, FC } from "react";
import profileIcon from "../images/person-circle-outline.svg";
import Axios from "axios";
import useCheckContext from "../hooks/useCheckContext";
import { useSearchParams } from "react-router-dom";
import imageIcon from "../images/image-outline.svg";

interface Props {
	setEdit: (value: boolean) => void;
	setImg: (value: string | null) => void;
	img: string | null;
	newLocation: string | null;
	setNewLocation: (value: string | null) => void;
	newAge: number | null;
	setNewAge: (value: number) => void;
	newBio: string | null;
	setNewBio: (value: string | null) => void;
}

const EditProfile: FC<Props> = ({
	setEdit,
	setImg,
	img,
	newLocation,
	setNewLocation,
	newAge,
	setNewAge,
	newBio,
	setNewBio,
}) => {
	const { user } = useCheckContext();

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const file = e.target.files[0]; // Get the selected file
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file); // Read file as data URL
			reader.onloadend = () => {
				setImg(reader.result as string); // Set image URL
			};
		}
	};

	const updateProfile = async () => {
		try {
			const res = await Axios.patch(
				// `https://rock-paper-scissors-app-iybf.onrender.com/api/user/edit/profile/${user?.username}`,
				`http://localhost:4001/api/user/edit/profile/${user?.username}`,
				{
					img,
					location: newLocation ? newLocation.trim() : "",
					age: newAge,
					bio: newBio ? newBio.trim() : "",
				}
			);
			const updatedUser = res.data;

			if (res.data) {
				localStorage.setItem("user", JSON.stringify(updatedUser));
				setEdit(false);

				setNewAge(updatedUser?.age);
				setNewLocation(updatedUser?.location);
				setNewBio(updatedUser?.bio);
			}
		} catch (error: any) {
			if (error?.response?.status === 413) {
				alert("File too large");
			}
			console.log(error);
		}
	};

	const [searchParams, setSearchParams] = useSearchParams("");

	return (
		<div className="edit-container">
			<div className="profile-header edit">
				<div className="image-container">
					<div className="image-overlay">
						<img
							src={imageIcon}
							alt="Profile"
							className="image-icon"
						/>
						Select a photo
					</div>
					<img
						src={img || profileIcon}
						alt="Profile"
						className="profile-pic"
					/>
					<input
						type="file"
						onChange={(e) => handleFileChange(e)}
						title="Select a photo"
					/>
				</div>
			</div>

			<div className="edit-profile-container">
				<form
					className="edit-profile-form"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					{/* <div className="form-group">
						<label htmlFor="name">Username</label>
						<input
							type="text"
							id="name"
							name="name"
							defaultValue={user?.username}
							placeholder="Enter your username"
							required
							onChange={(e) => setNewUsername(e.target.value)}
						/>
					</div> */}

					<div className="form-group shared">
						<div>
							<label htmlFor="location">Location</label>
							<input
								type="text"
								id="location"
								name="location"
								placeholder="Enter your location"
								defaultValue={newLocation || ""}
								onChange={(e) => setNewLocation(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="age">Age</label>
							<input
								type="number"
								id="age"
								name="age"
								min={0}
								max={99}
								placeholder="Enter your age"
								defaultValue={newAge || 18}
								onChange={(e) => setNewAge(Number(e.target.value))}
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="bio">Bio</label>
						<textarea
							id="bio"
							name="bio"
							placeholder="Tell us something about yourself"
							rows={3}
							defaultValue={newBio || ""}
							maxLength={255}
							onChange={(e) => setNewBio(e.target.value)}
						/>
					</div>

					<div className="buttons">
						<button
							type="submit"
							className="btn back-btn"
							onClick={() => {
								setEdit(false);
								setSearchParams((params) => ({
									...params,
								}));
							}}
						>
							Cancel
						</button>
						{(img !== user?.image ||
							(newLocation && newLocation.trim() !== user?.location) ||
							newAge !== user?.age ||
							(newBio && newBio.trim() !== user?.bio)) && (
							<button
								type="submit"
								className="btn save-btn"
								onClick={() => updateProfile()}
							>
								Save Changes
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
