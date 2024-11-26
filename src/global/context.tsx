import { createContext, createEffect, createSignal, JSX, useContext } from "solid-js";
import { isLoggedIn } from "~/api/client/auth";
import { getUserInfoPrivate } from "~/api/client/user";

export function emptyPrivate(): PrivateUSERACCOUNT {
	return { email: " - ", verified: false, username: "", capitalize: "", joined: new Date(), seen_at: new Date() }
}

const Context = createContext<{
	login: () => boolean
	ready: () => boolean
	user: () => PrivateUSERACCOUNT
	update: () => void
}>()

export default function (props: { children: JSX.Element }) {
	const login = createSignal<boolean>(false);
	const ready = createSignal<boolean>(false);
	const user = createSignal<PrivateUSERACCOUNT>(emptyPrivate());

	function reset() {
		ready[1](false)
		login[1](false);
		user[1](emptyPrivate())
	}

	async function update() {
		reset()
		try {
			const status = await isLoggedIn();
			login[1](status);
			console.log(status)
			if (status) {
				const userStatus = await getUserInfoPrivate()
				if (userStatus.success) {
					user[1](userStatus.data)
				} else {
					reset()
				}
			}
		} catch (error) {
			console.error("Error checking login status:", error);
			reset()
		}
		ready[1](true)
	}

	createEffect(() => { update() }, [])

	return (
		<Context.Provider value={{ login: login[0], ready: ready[0], user: user[0], update }}>
			{props.children}
		</Context.Provider>
	)
}

export function useGlobalContext() {
	const context = useContext(Context)
	if (!context) {
		throw new Error(`${useGlobalContext.name}: Provider missing.`);
	}
	return context
}