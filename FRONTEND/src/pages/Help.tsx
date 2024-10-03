import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DocsContent from "../components/DocsContent";
import HelpSidebar from "../components/HelpSidebar";

const Help = () => {
	const [page, setPage] = useState<string>("introduction");
	const [feature, setFeature] = useState<string>("introduction");

	const docsContentRef = useRef<HTMLDivElement>(null);

	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		setSearchParams((params) => ({ ...params, page }));

		if (docsContentRef.current) {
			docsContentRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	}, [page]);

	const [renderRoutes, setRenderRoutes] = useState(false);
	useEffect(() => {
		setRenderRoutes(false);
		const timer = setTimeout(() => {
			setRenderRoutes(true);
		}, 100);
	}, []);
	return (
		<div className="help-section">
			{renderRoutes && (
				<div className="help">
					<HelpSidebar
						page={page}
						setPage={setPage}
						setFeature={setFeature}
						feature={feature}
					/>

					<DocsContent
						docsContentRef={docsContentRef}
						page={page}
						setPage={setPage}
						feature={feature}
						setFeature={setFeature}
						setSearchParams={setSearchParams}
					/>
				</div>
			)}
		</div>
	);
};

export default Help;
