import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ContextProvider from "./context/ContextProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const rootElement = document.getElementById("root");
const client = new QueryClient();

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<QueryClientProvider client={client}>
				<Router>
					<ContextProvider>
						<App />
					</ContextProvider>
				</Router>
			</QueryClientProvider>
		</React.StrictMode>
	);
} else {
	console.error("Root element not found");
}
