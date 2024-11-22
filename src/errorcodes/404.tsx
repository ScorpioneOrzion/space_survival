import { Link, MetaProvider, Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
	return (
		<>
			<MetaProvider>
				<Title>404</Title>
				<Link rel="stylesheet" href="/404.css"></Link>
			</MetaProvider>
			<HttpStatusCode code={404} />
			<h1>404 Not Found</h1>
		</>
	);
}