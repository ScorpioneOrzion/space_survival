import { MetaProvider, Title } from "@solidjs/meta";
import { createContext, createEffect, createSignal, onCleanup, ParentProps, Show, useContext } from "solid-js";

export function emptyPrivate(): PrivateUSERACCOUNT {
	return { email: " - ", verified: 0, username: "", capitalize: "", joined: " - ", seen_at: " - " }
}

const Context = createContext<{
	login: ReturnType<typeof createSignal<boolean>>
	user: ReturnType<typeof createSignal<PrivateUSERACCOUNT>>
	ready: () => boolean
}>()

export default function (props: ParentProps) {
	const login = createSignal<boolean>(false);
	const ready = createSignal<boolean>(false);
	const user = createSignal<PrivateUSERACCOUNT>(emptyPrivate());

	function reset() {
		login[1](false);
		user[1](emptyPrivate())
	}

	async function update() {
		ready[1](false)
		reset()

		const userResponse = await fetch("/api/getUser", {
			method: "GET"
		})

		if (userResponse.ok) {
			const userData = await userResponse.json();
			const status = userData.userId !== undefined

			if (!status) {
				ready[1](true)
				return
			}

			login[1](true);

			const userNameRequest = new FormData();
			userNameRequest.append("userId", userData.userId.toString());

			const userNameResponse = await fetch("/api/request", {
				method: "POST",
				body: userNameRequest,
			});

			if (userNameResponse.ok) {
				const userNameData = await userNameResponse.json(); // Avoid redeclaration
				user[1](userNameData.user);
			} else {
				console.error("Failed to fetch user name data");
				reset();
			}
		} else {
			console.error("Failed to fetch user data");
			reset();
		}

		ready[1](true)
	}

	createEffect(() => { update() }, [])

	return (
		<>
			<Context.Provider value={{ login, ready: ready[0], user }}>
				{props.children}
			</Context.Provider>
		</>
	)
}

export function useGlobalContext() {
	const context = useContext(Context)
	if (!context) {
		throw new Error(`${useGlobalContext.name}: Provider missing.`);
	}
	return context
}