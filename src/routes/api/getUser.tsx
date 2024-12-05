import type { APIEvent } from "@solidjs/start/server";
import { getUserName, toFakePrivate, toPrivate, toPublic } from "~/api/server/userDb";
import session from "~/api/server/session";

export async function POST(event: APIEvent) {
	const formData = await event.request.formData();
	const username = formData.get("username") as string;
	const targetUsername = formData.get("targetuser") as string;

	const targetUser = getUserName(targetUsername);

	if (!targetUser.success) {
		return new Response(JSON.stringify({ error: "User not found" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (targetUser.data.current_status === "DELETED") {
		return new Response(JSON.stringify({ error: "User not found" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	const userDate = targetUser.data;

	if (userDate.username === username) {
		return new Response(JSON.stringify({ success: true, user: toPrivate(userDate) }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} else {
		return new Response(JSON.stringify({ success: true, user: toFakePrivate(toPublic(userDate)) }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}
}

export async function GET() {
	const sessionData = await session()
	return new Response(JSON.stringify({ userId: sessionData.data.userId }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}