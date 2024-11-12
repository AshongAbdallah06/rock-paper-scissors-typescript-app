import Axios from "axios";
import { ChangeEvent, FC, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";
import imageIcon from "../images/image-outline.svg";
import profileIcon from "../images/person-circle-outline.svg";

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
	const { user } = useContextProvider();
	const [changed, setChanged] = useState(false);

	const [tempImg, setTempImg] = useState<string | null>(img); // Temporary image for preview

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setTempImg(reader.result as string);
				setChanged(true);
			};
		}
	};

	const handleInputChange = (setter: (value: any) => void, value: any) => {
		setter(value);
		setChanged(true); // Mark as changed
	};

	const [searchParams, setSearchParams] = useSearchParams("");

	const updateProfile = async () => {
		try {
			const res = await Axios.patch(
				`https://rock-paper-scissors-app-iybf.onrender.com/api/user/edit/profile/${user?.username}`,
				// `http://localhost:4001/api/user/edit/profile/${user?.username}`,
				{
					img: tempImg,
					location: newLocation ? newLocation.trim() : "",
					age: newAge,
					bio: newBio ? newBio.trim() : "",
				}
			);
			const updatedUser = res.data;

			if (res.data) {
				localStorage.setItem("user", JSON.stringify(updatedUser));
				setEdit(false);

				setChanged(false);
				setNewAge(updatedUser?.age);
				setNewLocation(updatedUser?.location);
				setNewBio(updatedUser?.bio);
				setImg(updatedUser.image);
			}
		} catch (error: any) {
			if (error?.response?.status === 413) {
				alert("File too large");
			}
			console.log(error);
		}
	};

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
						src={tempImg || profileIcon}
						alt="Profile"
						className="profile-pic"
					/>
					<input
						type="file"
						onChange={handleFileChange}
						title="Select a photo"
					/>
				</div>
			</div>

			<div className="edit-profile-container">
				<form
					className="edit-profile-form"
					onSubmit={(e) => e.preventDefault()}
				>
					<div className="form-group shared">
						<div>
							<label htmlFor="location">Location</label>
							<input
								type="text"
								id="location"
								name="location"
								placeholder="Enter your location"
								defaultValue={newLocation || ""}
								onChange={(e) => handleInputChange(setNewLocation, e.target.value)}
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
								onChange={(e) =>
									handleInputChange(setNewAge, Number(e.target.value))
								}
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
							onChange={(e) => handleInputChange(setNewBio, e.target.value)}
						/>
					</div>

					<div className="buttons">
						<button
							type="button"
							className="btn back-btn"
							onClick={() => {
								setEdit(false);
								setSearchParams((params) => ({ ...params }));
							}}
						>
							Cancel
						</button>
						{changed && (
							<button
								type="button"
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
