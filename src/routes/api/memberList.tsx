import { getAllUsers } from "~/api/server/userDb"

export async function GET() {
	const result = getAllUsers();

	if (result.success) {
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(result), {
		status: 500,
		headers: { "Content-Type": "application/json" },
	});
}