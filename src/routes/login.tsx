import { MetaProvider, Title } from "@solidjs/meta";
import { createMemo, createSignal, Show } from "solid-js";
import LoginRegister from "~/components/auth/component-auth"
import '~/css/login.css'
import { useGlobalContext } from "~/global/context";
import { Navigate } from "@solidjs/router";

export default function () {
	const globalContext = useGlobalContext();
	const { login, ready, update } = globalContext
	const [errorMessage, setErrorMessage] = createSignal("");

	const shouldRedirect = createMemo(() => ready() && login());

	return (
		<>
			<MetaProvider>
				<Title>Login</Title>
			</MetaProvider>
			<div class={"center"}>
				<LoginRegister update={update} setErrorMessage={setErrorMessage} />
				<Show when={errorMessage() !== ""}>
					<div class={"errorMessage"}>
						<p>{errorMessage()}</p>
					</div>
				</Show>
			</div>
			<Show when={shouldRedirect()} ><Navigate href={"/"} /></Show>
		</>
	)
}