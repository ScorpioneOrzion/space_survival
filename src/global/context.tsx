import { createContext, createEffect, createSignal, JSX, useContext } from "solid-js";
import { isLoggedIn } from "~/api/client/auth";
import { getUserInfo } from "~/api/client/user";

const Context = createContext<{
	login: () => boolean
	ready: () => boolean
	user: () => USERACCOUNT
	update: () => void
}>()

export default function (props: { children: JSX.Element }) {
	const login = createSignal<boolean>(false);
	const ready = createSignal<boolean>(false);
	const user = createSignal<USERACCOUNT>({ username: "", email: "" });

	function reset() {
		ready[1](false)
		login[1](false);
		user[1]({ username: "", email: "" })
	}

	async function update() {
		reset()
		try {
			const status = await isLoggedIn();
			login[1](status);
			if (status) {
				const userStatus = await getUserInfo()
				if (userStatus.success) user[1](userStatus.data)
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