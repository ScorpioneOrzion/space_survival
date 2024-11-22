import { ParentProps, Show } from "solid-js";
import { useGlobalContext } from "~/global/context";
import { logout } from "~/api/client/auth";
import isSuccess from "~/helper/isSuccess";
import { Navigate } from "@solidjs/router";

export default function (prop: ParentProps) {
	const { login, ready, user, update } = useGlobalContext()

	return (
		<>
			<div class={"account"}>
				<Show when={ready()}>
					<div id="user">{user().username}</div>
					<div id="email">{user().email}</div>
					<Show when={!login()} ><Navigate href={"/login"} /></Show>
				</Show>
				<button type="button" class={"login"} onClick={async () => {
					const response = await logout()
					if (isSuccess(response)) update()
				}}>Logout</button>
			</div>
		</>
	)
}