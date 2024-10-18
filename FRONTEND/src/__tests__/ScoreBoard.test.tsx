import { screen, render } from "@testing-library/react";
import ScoreBoard from "../components/ScoreBoard";
import ContextProvider from "../context/ContextProvider";
import { BrowserRouter as Router } from "react-router-dom";

const MockScoreBoard = () => {
	return (
		<Router>
			<ContextProvider>
				<ScoreBoard />
			</ContextProvider>
		</Router>
	);
};

describe("Test Scoreboard component", () => {
	test("render score value", () => {
		render(<MockScoreBoard />);
	});
});
