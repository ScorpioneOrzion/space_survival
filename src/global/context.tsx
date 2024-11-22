import { createContext, createEffect, createSignal, JSX, onCleanup, onMount, useContext } from "solid-js";
import { isServer } from "solid-js/web";
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
	size: () => { width: number, height: number }
}>()

export default function (props: { children: JSX.Element }) {
	const login = createSignal<boolean>(false);
	const ready = createSignal<boolean>(false);
	const user = createSignal<PrivateUSERACCOUNT>(emptyPrivate());
	const size = createSignal({ width: 0, height: 0 })

	function resize() {
		size[1]({ width: window.innerWidth, height: window.innerHeight })
	}

	function reset() {
		ready[1](false)
		login[1](false);
		user[1](emptyPrivate())
		if (!isServer) resize()
	}

	onMount(() => {
		if (!isServer) window.addEventListener('resize', resize)
	})

	onCleanup(() => {
		if (!isServer) window.removeEventListener('resize', resize)
	})

	async function update() {
		reset()
		try {
			const status = await isLoggedIn();
			login[1](status);
			if (status) {
				const userStatus = await getUserInfoPrivate()
				if (userStatus.success) {
					user[1](userStatus.data)
				}
			}
		} catch (error) {
			console.error("Error checking login status:", error);
			reset()
		}
		ready[1](true)
	}

	createEffect(async () => {
		update()
	})

	return (
		<Context.Provider value={{ login: login[0], ready: ready[0], user: user[0], size: size[0], update }}>
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