import { createSignal } from "solid-js";
import { isLoggedIn } from "~/api/client/auth";
import LoginRegister from "~/components/auth/login-register"
import '~/css/login.css'
import { useGlobalContext } from "~/global/context";

export default function () {
	const [loggedIn, setLoggedIn] = useGlobalContext().login;
	const [errorMessage, setErrorMessage] = createSignal("");
	const ready = useGlobalContext().ready;

	async function checkLoginStatus() {
		try {
			const status = await isLoggedIn();
			setLoggedIn(status);
			setErrorMessage('');
		} catch (error) {
			console.error("Error checking login status:", error);
			setLoggedIn(false);
			setErrorMessage("Error checking login status")
		}
	}
	return (
		<div class={"center"}>
			<LoginRegister checkStatus={checkLoginStatus} setErrorMessage={setErrorMessage} />
		</div>
	)
}