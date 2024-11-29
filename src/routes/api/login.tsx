import type { APIEvent } from "@solidjs/start/server";
import { getUserName, toPrivate, updateUser, verifyPassword } from "~/api/server/db";
import session from "~/api/server/session";

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