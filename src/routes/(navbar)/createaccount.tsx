import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { register } from "~/api/client/auth";
import DisplayPassword from "~/components/displayPassword";
import { useGlobalContext } from "~/global/context";
import createHTMLSignal from "~/helper/createHTMLSignal";
import isHTMLElement from "~/helper/isHTMLElement";

export default function () {
	const [userNameElem, setUserNameElem] = createHTMLSignal<HTMLInputElement>();
	const [emailElem, setEmailElem] = createHTMLSignal<HTMLInputElement>();
	const [passWordElem, setPassWordElem] = createHTMLSignal<HTMLInputElement>();
	const [passWordConfirmElem, setPassWordConfirmElem] = createHTMLSignal<HTMLInputElement>();
	const [navigate, setNavigate] = createSignal(false)

	const globalContext = useGlobalContext();
	const { update, user, ready } = globalContext

	async function handleSubmit(e: SubmitEvent) {
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
			const password = passWordElement.value.trim();
			const confirmPassword = passWordConfirmElement.value.trim();

			if (username === "" || email === "" || password === "" || confirmPassword === "") {
				return
			}

			if (password !== confirmPassword) {
				return
			}

			const formData = new FormData()
			formData.append('username', username)
			formData.append('password', password)
			formData.append('email', email)

			const response = await register(formData)
			if (response.success) update()
		}
	}

	createEffect(() => {
		setNavigate(ready() && !!user().username);
	})

	return <>
		<MetaProvider>
			<Title>Create Acount</Title>
		</MetaProvider>
		<div class={"center"}>
			<form onSubmit={handleSubmit} class={'auth register'}>
				<div class={"form-group"}>
					<label id="title">Register</label>
					<label>Please enter details to register</label>
				</div>
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
				<div class={"form-group"}>
					<input
						type="email"
						title="email"
						ref={setEmailElem}
						placeholder="Email"
						autocomplete="email"
						required
					/>
				</div>
				<DisplayPassword
					title="password"
					ref={setPassWordElem}
					placeholder="Password"
					current={false}
				/>
				<DisplayPassword
					title="confirm password"
					ref={setPassWordConfirmElem}
					placeholder="Confirm password"
					current={false}
				/>
				<div class={"form-group"}>
					<input type="submit" value={'Register'} />
				</div>
			</form>
		</div>
		<Show when={navigate()}><Navigate href={`/profile/${user().username}`}></Navigate></Show>
	</>
}