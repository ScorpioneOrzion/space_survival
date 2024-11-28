import { createContext, createEffect, createSignal, ParentProps, useContext } from "solid-js";
import { getUserInfoPrivate } from "~/api/client/user";
import session from "~/api/server/session";

export function emptyPrivate(): PrivateUSERACCOUNT {
	return { email: " - ", verified: 0, username: "", capitalize: "", joined: " - ", seen_at: " - " }
}

async function isLoggedIn(): Promise<boolean> {
	"use server"
	try {
		const sessionData = await session();
		return typeof sessionData.data.userId === 'number';
	} catch (error) {
		return false;
	}
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
		try {
			const status = await isLoggedIn();
			login[1](status);
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
		<Context.Provider value={{ login, ready: ready[0], user }}>
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