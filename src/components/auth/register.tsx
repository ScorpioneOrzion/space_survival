import isHTMLElement from "~/helper/isHTMLElement";
import createHTMLSignal from "~/helper/createHTMLSignal";
import { register } from "~/routes/api/client/auth";
import isSuccess  from "~/helper/isSuccess";

export default function ({ checkStatus, setErrorMessage }: { checkStatus: () => Promise<void>, setErrorMessage: (msg: string) => void }) {
	const [userNameElem, setUserNameElem] = createHTMLSignal<HTMLInputElement>();
	const [emailElem, setEmailElem] = createHTMLSignal<HTMLInputElement>();
	const [passWordElem, setPassWordElem] = createHTMLSignal<HTMLInputElement>();
	const [passWordConfirmElem, setPassWordConfirmElem] = createHTMLSignal<HTMLInputElement>();

	async function handleRegisterSubmit(e: SubmitEvent) {
		e.preventDefault()

		const userNameElement = userNameElem();
		const emailElement = emailElem();
		const passWordElement = passWordElem();
		const passWordConfirmElement = passWordConfirmElem();

		if (
			isHTMLElement(userNameElement) &&
			isHTMLElement(emailElement) &&
			isHTMLElement(passWordElement) &&
			isHTMLElement(passWordConfirmElement)
		) {
			const username = userNameElement.value.trim();
			const email = emailElement.value.trim();
			const password = passWordElement.value;
			const confirmPassword = passWordConfirmElement.value;
			if (username === "" || email === "" || password === "" || confirmPassword === "") {
				setErrorMessage("All fields are required.");
				return;
			}

			if (password !== confirmPassword) {
				setErrorMessage("Passwords do not match.");
				return;
			}

			const formData = new FormData()
			formData.append('username', username)
			formData.append('password', password)
			formData.append('email', email)

			const response = await register(formData)
			if (isSuccess(response)) await checkStatus()
			else setErrorMessage(response.error)
		} else {
			setErrorMessage("Invalid elements.");
		}
	}

	return (
		<form onSubmit={handleRegisterSubmit}>
			<input
				type="text"
				title="username"
				ref={setUserNameElem}
				placeholder="Username"
				autocomplete="username"
				required
			/>
			<input
				type="text"
				title="email"
				ref={setEmailElem}
				placeholder="Email"
				autocomplete="email"
				required
			/>
			<input
				type="password"
				title="create password"
				ref={setPassWordElem}
				placeholder="Create password"
				autocomplete="new-password"
				required
			/>
			<input
				type="password"
				title="confirm password"
				ref={setPassWordConfirmElem}
				placeholder="Confirm password"
				autocomplete="new-password"
				required
			/>
			<button type="submit">Register</button>
		</form>
	)
}