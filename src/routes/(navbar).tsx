import { useGlobalContext } from "~/global/context";
import { Show } from "solid-js";
import { A, RouteSectionProps } from "@solidjs/router";

export default function (prop: RouteSectionProps) {
	const globalContext = useGlobalContext();
	const { login: [login], ready, user: [user] } = globalContext

	return (
		<Show when={ready()}>
			<header>
				<div class={"hidden"}></div>
				<div></div>
				<nav>
					<A href="/play">Play</A>
					<A href="/news">News</A>
					{login() ? (
						<>
							<A href={`/profile/${user().username}`}>Profile</A>
							<A href="/logout">Logout</A>
						</>
					) : (
						<>
							<A href="/login">Login</A>
							<A href="/createaccount">Create Account</A>
						</>
					)}
				</nav>
				<div></div>
			</header>
			{prop.children}
		</Show>
	)
}