import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { createSignal, onMount, Show } from "solid-js";
import session from "~/api/server/session";
import { emptyPrivate, useGlobalContext } from "~/global/context";

export async function POST(event: APIEvent) {
	const sessionData = await session()

	await sessionData.update((userSession: UserSession) => {
		userSession.userId = undefined
		return userSession;
	})

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export default function () {
	const globalContext = useGlobalContext()
	const [navigate, setNavigate] = createSignal(false)
	
	const { user: [, user], login: [, login] } = globalContext

	onMount(async () => {
		const response = await fetch("./logout", {
			method: "POST"
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