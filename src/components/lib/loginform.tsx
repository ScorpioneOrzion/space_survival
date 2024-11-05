import isHTMLElement from "~/helper/isHTMLElement";
import createHTMLSignal from "~/helper/createHTMLSignal";

export default function LoginForm() {
	const [userNameElem, setUserNameElem] = createHTMLSignal<HTMLInputElement>()
	const [passWordElem, setPassWordElem] = createHTMLSignal<HTMLInputElement>()

	async function handleSubmit(e: SubmitEvent) {
		const userNameElement = userNameElem()
		const passWordElement = passWordElem()
		e.preventDefault()
		if (isHTMLElement(userNameElement) && isHTMLElement(passWordElement)) {
			const username = userNameElement.value.trim();
			const password = passWordElement.value;

			if (username === "" || password === "") {
				console.error("Username and password cannot be empty.");
				alert("Please enter both username and password.");  // User-friendly alert
				return;  // Exit if validation fails
			}

			const formData = new FormData();
			formData.append('username', username);
			formData.append('password', password);

			console.log("FormData prepared:", Array.from(formData.entries()));

			try {
                // await login(formData);  // Ensure login function is defined and handles the formData
                // Clear inputs or reset state as needed
                setUserNameElem(() => null);  // Clear username
                setPassWordElem(() => null);  // Clear password
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.'); // User feedback
            }
		} else {
			console.error("Invalid username or password element.");
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" title="username" ref={setUserNameElem} placeholder="Username" />
			<input type="password" title="password" ref={setPassWordElem} placeholder="Password" />
			<button type="submit">Log In</button>
		</form>
	)
}