import { MetaProvider, Title } from "@solidjs/meta";

export default function () {
	return (
		<>
			<MetaProvider>
				<Title>Space Survival</Title>
			</MetaProvider>
		</>
	)
}