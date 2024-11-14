import { createContext, createEffect, createSignal, JSX, useContext } from "solid-js";
import { isLoggedIn } from "~/api/client/auth";

const Context = createContext<{
	login: ReturnType<typeof createSignal<boolean>>
	ready: () => boolean
}>()

export default function (props: { children: JSX.Element }) {
	const login = createSignal(false)
	const ready = createSignal(false)

	createEffect(async () => {
		try {
			const status = await isLoggedIn();
			login[1](status);
		} catch (error) {
			console.error("Error checking login status:", error);
			login[1](false);
		}
		ready[1](true)
	})

	return (
		<Context.Provider value={{ login, ready: ready[0] }}>
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