import { MetaProvider, Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { createSignal, Show } from "solid-js";
import { getUserName, toPrivate, updateUser, verifyPassword } from "~/api/server/db";
import session from "~/api/server/session";
import { useGlobalContext } from "~/global/context";

export async function POST(event: APIEvent) {
	const formData = await event.request.formData();
	const username = formData.get('username') as string;
	const password = formData.get('password') as string;
	const sessionData = await session()
	const user = getUserName(username)

	if (!user.success) {
		return new Response(JSON.stringify({ error: "Invalid credentials" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const userData = user.data

	if (!userData || !verifyPassword(password, userData.salt, userData.password_hash)) {
		return new Response(JSON.stringify({ error: "Invalid credentials" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

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
			const response = await fetch("./login", {
				method: "POST",
				body: formData
			})

			if (response.ok) {
				const data = await response.json()
				if (data.success) {
					user(data.user)
					login(true)
					setLocation(`/profile/${data.user.username}`)
				}
			} else {
				const errorData = await response.json()
				setError(errorData.error);
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
		}
	}

	return (
		<>
			<MetaProvider>
				<Title>Log In</Title>
			</MetaProvider>
			<main>
				<form onSubmit={handleSubmit} id="form" class={"center"}>
					<div class={"formfield"}>
						<div id="usernameinputline">
							<label for="username">Username:</label>
							<input id="username" type="text" name="username" required maxlength={40} autocomplete="username" />
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
	)
}