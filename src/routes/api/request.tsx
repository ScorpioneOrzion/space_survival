import type { APIEvent } from "@solidjs/start/server";
import { getUserId, toPrivate } from "~/api/server/db";
export async function POST(event: APIEvent) {
	const formData = await event.request.formData();
	const userID = formData.get("userId") as string;
	const data = getUserId(Number(userID))

	if (data.success) {
		return new Response(JSON.stringify({ user: toPrivate(data.data) }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ error: "User not found" }), {
		status: 401,
		headers: { "Content-Type": "application/json" },
	});
}