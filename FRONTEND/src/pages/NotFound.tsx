import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const NotFound = (): ReactElement | null => {
	const [renderUnknownRoutes, setRenderUnknownRoutes] = useState<boolean>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setRenderUnknownRoutes(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	return renderUnknownRoutes ? (
		<div className="not-found">
			<Logo />
			<h1>Page not found</h1>
			<Link
				to="/"
				style={{ color: "white" }}
				className="not-found-btn btn"
			>
				Go Back Home
			</Link>
		</div>
	) : null;
};

export default NotFound;
