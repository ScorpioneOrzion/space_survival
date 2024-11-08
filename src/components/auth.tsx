import { createSignal, onMount, Show } from "solid-js";
import { isLoggedIn } from "~/routes/api/client/auth";
import Logout from "./auth/logout";
import LoginRegister from "./auth/login-register";

export default function () {
	const [loggedIn, setLoggedIn] = createSignal(false);
	const [errorMessage, setErrorMessage] = createSignal("");

	async function checkLoginStatus() {
		try {
			const status = await isLoggedIn(); // Call to check if the user is logged in
			setLoggedIn(status);
			setErrorMessage('');
		} catch (error) {
			console.error("Error checking login status:", error);
			// Optionally show a fallback or error message
			setLoggedIn(false); // Default to logged out state in case of error
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