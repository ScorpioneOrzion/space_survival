import sessionServer from "../server/session";

export async function getUser() {
	"use server";
	const session = await sessionServer()
	console.log(session.data)
}