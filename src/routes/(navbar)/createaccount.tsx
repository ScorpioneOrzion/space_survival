import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { createSignal, Show } from "solid-js";
import { addUser, getUserName, toPrivate, updateUser } from "~/api/server/db";
import session from "~/api/server/session";
import { useGlobalContext } from "~/global/context";

export async function POST(event: APIEvent) {
	const formData = await event.request.formData();
	const username = formData.get('username') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const sessionData = await session()
	const register = addUser(username, password, email)

	if (!register.success) {
		return new Response(JSON.stringify({ error: "Invalid register" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const user = getUserName(username)

	if (!user.success) {
		return new Response(JSON.stringify({ error: "Invalid credentials" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const userData = user.data

	updateUser(userData.id)
	await sessionData.update((d: UserSession) => {
		d.userId = userData.id;
		return d;
	})

	const userPrivate = toPrivate(user.data)

	return new Response(JSON.stringify({ success: true, user: userPrivate }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export default function () {
	const [error, setError] = createSignal("");
	const [location, setLocation] = createSignal("");

	const globalContext = useGlobalContext();
	const { user: [, user], login: [, login] } = globalContext

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		const formData = new FormData(event.target as HTMLFormElement)

		try {
			const response = await fetch("./createaccount", {
				method: "POST",
				body: formData
			})

			if (response.ok) {
				const data = await response.json()
				if (data.success) {
					user(data.user)
					login(true)
					setLocation(data.user.username)
				}
			} else {
				const errorData = await response.json()
				setError(errorData.error);
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
		}
	}

	return <>
		<MetaProvider>
			<Title>Create Acount</Title>
		</MetaProvider>
		<main>
			<form onSubmit={handleSubmit} id="form" class={"center"}>
				<div class={"formfield"}>
					<div id="usernameinputline">
						<label for="username">Username:</label>
						<input id="username" type="text" name="username" required maxlength={40} autocomplete="username" />
					</div>
					<div id="emailinputline">
						<label for="email">Email:</label>
						<input id="email" type="email" name="email" required maxLength={320} minlength={3} autocomplete="email" />
					</div>
					<div id="passwordinputline">
						<label for="password">Password:</label>
						<input id="password" type="password" name="password" required autocomplete="current-password" />
					</div>
				</div>
				<input type="submit" value={"Log In"} class={"ready"} id="submit" />
			</form>
		</main>
		<Show when={location() !== ""}><Navigate href={location()} /></Show>
	</>
}