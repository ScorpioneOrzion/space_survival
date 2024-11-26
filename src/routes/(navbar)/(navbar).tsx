import { MetaProvider, Title } from "@solidjs/meta";

export default function () {
	return (
		<>
			<MetaProvider>
				<Title>Home</Title>
			</MetaProvider>
		</>
	)
}