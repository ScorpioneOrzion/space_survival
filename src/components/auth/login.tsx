import isHTMLElement from "~/helper/isHTMLElement";
import createHTMLSignal from "~/helper/createHTMLSignal";
import { login } from "~/routes/api/client/auth";
import isSuccess from "~/helper/isSuccess";
import DisplayPassword from "./displayPassword";

export default function ({ checkStatus, setErrorMessage }: { checkStatus: () => Promise<void>, setErrorMessage: (msg: string) => void }) {
	const [userNameElem, setUserNameElem] = createHTMLSignal<HTMLInputElement>();
	const [passWordElem, setPassWordElem] = createHTMLSignal<HTMLInputElement>();

	async function handleLoginSubmit(e: SubmitEvent) {
		e.preventDefault();  // Prevent default form submission
		const userNameElement = userNameElem();
		const passWordElement = passWordElem();

		if (isHTMLElement(userNameElement) && isHTMLElement(passWordElement)) {
			const username = userNameElement.value.trim();
			const password = passWordElement.value;

			// Validation
			if (username === "" || password === "") {
				setErrorMessage("Username and password cannot be empty.");
				return;  // Exit if validation fails
			}

			// Prepare FormData
			const formData = new FormData();
			formData.append('username', username);
			formData.append('password', password);

			const response = await login(formData);
			if (isSuccess(response)) await checkStatus()
			else setErrorMessage(response.error)
		} else {
			setErrorMessage("Invalid elements.");
		}
	}

	return (
		<form onSubmit={handleLoginSubmit} class={'auth'}>
			<div class={"form-group"}>
				<input
					type="text"
					title="username"
					ref={setUserNameElem}
					placeholder="Username"
					autocomplete="username"
					required
				/>
			</div>
			<DisplayPassword
				ref={setPassWordElem}
				current={true}
				title="password"
				placeholder="Password"
			/>
			<div class={"form-group"}>
				<input type="submit" value={'Log In'} />
			</div>
		</form>
	)
}