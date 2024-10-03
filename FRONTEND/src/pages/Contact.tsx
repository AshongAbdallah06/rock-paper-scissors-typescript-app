import React, { FC } from "react";
import Logo from "../components/Logo";

interface Props {
	setPage: (value: string) => void;
	setFeature: (value: string) => void;
}
const Contact: FC<Props> = ({ setPage, setFeature }) => {
	return (
		<div className="contact">
			<Logo />

			<form>
				<h1>Leave a message</h1>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						placeholder="Enter title here"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="title">Message</label>
					<textarea
						className="feedback"
						placeholder="Enter feedback here"
					/>
				</div>

				<div className="buttons">
					<button
						type="submit"
						className="btn back-btn"
						onClick={() => {
							setPage("features");
							setFeature("leaderboard");
						}}
					>
						Back
					</button>

					<button
						type="submit"
						className="btn submit"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default Contact;
