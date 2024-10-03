import React, { FC, RefObject } from "react";
import Introduction from "./Docs/Introduction";
import Other from "./Docs/Other";
import Contact from "../pages/Contact";

interface Props {
	page: string;
	setPage: (value: string) => void;
	docsContentRef: RefObject<HTMLDivElement>;
	feature: string;
	setFeature: (value: string) => void;
	setSearchParams: (value: URLSearchParams | Record<string, any>) => void; // Specify if using URLSearchParams
}

const DocsContent: FC<Props> = ({
	page,
	setPage,
	docsContentRef,
	feature,
	setFeature,
	setSearchParams,
}) => {
	return (
		<div className="content">
			{page === "introduction" && (
				<Introduction
					setPage={setPage}
					feature={feature}
					setSearchParams={setSearchParams}
				/>
			)}
			{page === "features" && (
				<Other
					setPage={setPage}
					feature={feature}
					setFeature={setFeature}
					docsContentRef={docsContentRef}
					setSearchParams={setSearchParams}
				/>
			)}
			{page === "contact" && (
				<Contact
					setFeature={setFeature}
					setPage={setPage}
				/>
			)}
		</div>
	);
};

export default DocsContent;
