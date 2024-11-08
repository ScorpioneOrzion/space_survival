import { MetaProvider, Title } from "@solidjs/meta";
import Auth from "~/components/auth";
import replacer from "~/helper/replacer";

export default function () {
	return (
		<>
			<MetaProvider>
				<Title>Login</Title>
			</MetaProvider>
			<Auth></Auth>
		</>
	)
}