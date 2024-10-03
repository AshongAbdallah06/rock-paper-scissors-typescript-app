import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CheckContextProvider from "./context/CheckContextProvider";
import { BrowserRouter as Router } from "react-router-dom";

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<Router>
				<CheckContextProvider>
					<App />
				</CheckContextProvider>
			</Router>
		</React.StrictMode>
	);
} else {
	console.error("Root element not found");
}
