import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { logout } from "~/api/client/auth";
import { useGlobalContext } from "~/global/context";

export default function () {
	const globalContext = useGlobalContext()
	const [navigate, setNavigate] = createSignal(false)
	onMount(async () => {
		await logout()
		globalContext.update()
		setNavigate(true)
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