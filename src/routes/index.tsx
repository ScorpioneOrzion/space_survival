import { MetaProvider, Title } from "@solidjs/meta";
import { createEffect } from "solid-js";
import { useGlobalContext } from "~/context";

export default function () {
	const { login, ready } = useGlobalContext()
	const [loggedIn] = login;

	createEffect(() => {
		if (ready()) {
			if (loggedIn()) {
				console.log('logged in')
			} else {
				console.log('logged out')
			}
		}
	})

	return (
		<>
			<MetaProvider>
				<Title>Space Survival</Title>
			</MetaProvider>
		</>
	)
}