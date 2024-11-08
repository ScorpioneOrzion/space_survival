import { createSignal, onMount, Show } from "solid-js";
import { isLoggedIn } from "~/routes/api/client/auth";
import Logout from "./auth/logout";
import LoginRegister from "./auth/login-register";

export default function () {
	const [loggedIn, setLoggedIn] = createSignal(false);
	const [errorMessage, setErrorMessage] = createSignal("");

	async function checkLoginStatus() {
		try {
			const status = await isLoggedIn();
			setLoggedIn(status);
			setErrorMessage('');
		} catch (error) {
			console.error("Error checking login status:", error);
			setLoggedIn(false);
		}
	}

	onMount(() => {
		checkLoginStatus();
	});

	return (
		<>
			{loggedIn() ? (
				<Logout checkStatus={checkLoginStatus} setErrorMessage={setErrorMessage} />
			) : (
				<LoginRegister checkStatus={checkLoginStatus} setErrorMessage={setErrorMessage} />
			)
			}
			<Show when={errorMessage() !== ""}>
				<div>
					<p>{errorMessage()}</p>
				</div>
			</Show>
		</>
	)
}