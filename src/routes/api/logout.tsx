import session from "~/api/server/session";

export async function GET() {
	const sessionData = await session()

	const sessionAfter = await sessionData.update((userSession: UserSession) => {
		userSession.userId = undefined
		return userSession;
	})

	if (sessionData.data.userId === undefined) {
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}
	
	return new Response(JSON.stringify({ error: "Invalid Logout" }), {
		status: 401,
		headers: { "Content-Type": "application/json" },
	});
}