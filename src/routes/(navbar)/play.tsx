import { RouteSectionProps } from "@solidjs/router"
import { onMount, Show } from "solid-js"
import { useGlobalContext } from '../../global/context';
import { MetaProvider, Title } from "@solidjs/meta";

export default function (props: RouteSectionProps) {
	const globalContext = useGlobalContext()

	const { login: [login] } = globalContext

	return (
		<main>
			<Show when={login()} fallback={
				<p>Login before playing</p>
			}>
				{props.children}
			</Show>
		</main>
	)
}