import { useGlobalContext } from "~/global/context";
import { createEffect, Show } from "solid-js";
import { A, RouteSectionProps } from "@solidjs/router";

export default function (prop: RouteSectionProps) {
	const globalContext = useGlobalContext();
	const { login, ready, user } = globalContext

	createEffect(() => {
		if (ready()) {
			console.log(user())
		}
		console.log(user())
		console.log(login())
	})

	return (
		<>
			<header>
				<Show when={ready()}>
					<A title="play" href="/play">Play</A>
					<A title="news" href="/news">News</A>
					{login() ? (
						<>
							<A title="profile" href={`/profile/${user().username}`}>Profile</A>
							<A title="logout" href="/logout">Logout</A>
						</>
					) : (
						<>
							<A title="login" href="/login">Login</A>
							<A title="createaccount" href="/createaccount">Create Account</A>
						</>
					)}
				</Show>
			</header>
			{prop.children}
		</>
	)
}