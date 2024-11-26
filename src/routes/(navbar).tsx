import { useGlobalContext } from "~/global/context";
import { Show } from "solid-js";
import { A, RouteSectionProps } from "@solidjs/router";

export default function (prop: RouteSectionProps) {
	const globalContext = useGlobalContext();
	const { login, ready, user } = globalContext

	return (
		<Show when={ready()}>
			<header>
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
			</header>
			{prop.children}
		</Show>
	)
}