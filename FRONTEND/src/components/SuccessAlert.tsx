import { FC } from "react";
import checkmark from "../images/checkmark.png";

interface Props {
	successTitle: string;
	successDescription: string;
}
const SuccessAlert: FC<Props> = ({ successTitle, successDescription }) => {
	return (
		<div className="error-alert-container">
			<div className="error-alert">
				<div className="alert-content">
					<div className="icon-container">
						<img
							src={checkmark}
							className="icon"
							alt="checkmark"
						/>
					</div>
					<div className="alert-text">
						{successTitle !== "Redirecting" ? (
							<>
								<p className="alert-title">{successTitle}</p>
								<p className="alert-description">{successDescription}</p>
							</>
						) : (
							<p className="alert-title">{successTitle}</p>
						)}

						{successTitle === "Redirecting" && (
							<p className="alert-description">You will be redirected shortly...</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuccessAlert;
