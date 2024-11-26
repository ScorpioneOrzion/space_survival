import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { login } from "~/api/client/auth";
import DisplayPassword from "~/components/displayPassword";
import { useGlobalContext } from "~/global/context";
import createHTMLSignal from "~/helper/createHTMLSignal";
import isHTMLElement from "~/helper/isHTMLElement";

export default function () {
	const [userNameElem, setUserNameElem] = createHTMLSignal<HTMLInputElement>();
	const [passWordElem, setPassWordElem] = createHTMLSignal<HTMLInputElement>();
	const [navigate, setNavigate] = createSignal(false)

	const globalContext = useGlobalContext();
	const { update, user, ready } = globalContext

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		const userNameElement = userNameElem();
		const passWordElement = passWordElem();

		if (
			isHTMLElement(userNameElement) &&
			isHTMLElement(passWordElement)
		) {
			const username = userNameElement.value.trim();
			const password = passWordElement.value.trim();

			if (username === "" || password === "") {
				return
			}
			
			const formData = new FormData();
			formData.append('username', username);
			formData.append('password', password);

			const response = await login(formData)
			if (response.success) {
				update()
			}
		}
	}

	createEffect(() => {
		setNavigate(ready() && !!user().username);
	})

	return (
		<>
			<MetaProvider>
				<Title>Log In</Title>
			</MetaProvider>
			<div class={"center"}>
				<form onSubmit={handleSubmit} class={'auth login'}>
					<div class={"form-group"}>
						<label id="title">Login</label>
						<label>Please login to your account</label>
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
			</div>
			<Show when={navigate()}><Navigate href={`/profile/${user().username}`}></Navigate></Show>
		</>
	)
}