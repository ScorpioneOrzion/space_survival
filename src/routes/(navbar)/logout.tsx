import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { emptyPrivate, useGlobalContext } from "~/global/context";

export default function () {
	const globalContext = useGlobalContext()
	const [navigate, setNavigate] = createSignal(false)

	const { user: [, user], login: [, login] } = globalContext

	onMount(async () => {
		const response = await fetch("/api/logout", {
			method: "GET"
		})
		if (response.ok) {
			user(emptyPrivate())
			login(false)
			setNavigate(true)
		}
	})
	return (
		<>
			<MetaProvider>
				<Title>Logout</Title>
			</MetaProvider>
			<Show when={navigate()}><Navigate href={"/"}></Navigate></Show>
		</>
	)
}