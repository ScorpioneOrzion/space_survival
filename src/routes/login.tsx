import { MetaProvider, Title } from "@solidjs/meta";
import { getUser } from "./api/client/admin";

export default function () {
	return (
		<>
			<MetaProvider>
				<Title>Login</Title>
			</MetaProvider>
			<button type="button" title="test" onclick={getUser}>getUser</button>
		</>
	)
}