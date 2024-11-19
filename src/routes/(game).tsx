import { useGlobalContext } from "~/global/context";
import { createEffect, createSignal, ParentProps, Show } from "solid-js";
import { logout } from "~/api/client/auth";
import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import "~/css/(game).css"
import isSuccess from "~/helper/isSuccess";

export default function (prop: ParentProps) {
	const globalContext = useGlobalContext();
	const { login, ready, user, update } = globalContext
	const [toLogin, setToLogin] = createSignal(false);
	const [openAccount, setOpenAccount] = createSignal(false);

	createEffect(() => {
		if (ready()) {
			console.log(user())
		}
	})

	return (
		<>
			<MetaProvider>
				<Title>Space Survival</Title>
			</MetaProvider>
			<div class={"topbar"}>
				<Show when={ready()}>
					<div classList={{ account: true, open: openAccount() }}>
						<button type="button" class={"account"} onclick={() => {
							setOpenAccount(!openAccount())
						}}>Account</button>
						<div id="user">{user().username}</div>
						<div id="email">{user().email}</div>
						<Show when={login()} fallback={
							<>
								<button type="button" class={"login"} onClick={() => {
									setToLogin(true)
								}}>Login</button>
								<Show when={toLogin()} ><Navigate href={"/login"} /></Show>
							</>
						}><button type="button" class={"login"} onClick={async () => {
							const response = await logout()
							if (isSuccess(response)) update()
						}}>Logout</button>
						</Show>
					</div>
				</Show>
			</div>
			{prop.children}
		</>
	)
}