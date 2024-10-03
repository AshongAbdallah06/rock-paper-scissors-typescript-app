import React, { FC } from "react";

interface Props {
	setShowFilterDropdown: (value: boolean) => void;
	optChanges: string | null;
	setOptChanges: (value: string) => void;
}

const FilterDropdown: FC<Props> = ({ setShowFilterDropdown, setOptChanges }) => {
	return (
		<ul className="filter-dropdown">
			<li
				onClick={() => {
					setOptChanges("wins");
					setShowFilterDropdown(false);
				}}
			>
				Wins
			</li>
			<li
				onClick={() => {
					setOptChanges("losses");
					setShowFilterDropdown(false);
				}}
			>
				Losses
			</li>
			<li
				onClick={() => {
					setOptChanges("ties");
					setShowFilterDropdown(false);
				}}
			>
				Ties
			</li>
			<li
				onClick={() => {
					setOptChanges("games_played");
					setShowFilterDropdown(false);
				}}
			>
				Games Played
			</li>
		</ul>
	);
};

export default FilterDropdown;
