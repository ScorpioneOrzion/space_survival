import type { APIEvent } from "@solidjs/start/server";
import { addUser, getUserName, updateUser, toPrivate } from "~/api/server/db";
import session from "~/api/server/session";

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