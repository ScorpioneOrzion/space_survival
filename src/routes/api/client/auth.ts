import session from "../server/session";
import { addUser, generateUserId, getUserName, verifyPassword } from "../server/db";

function errorResult(err: any): ERRORRESPONSE {
	return {
		success: false,
		error: (err instanceof Error) ? err.message : (typeof err === 'string' ? err : 'Unknown error')
	} as const
}

async function isLoggedInServer() {
	"use server"
	try {
		const sessionData = await session();
		return sessionData.data.userId != null; // Checks for null and undefined
	} catch (error) {
		console.error("Error checking session:", error);
		return false;
	}
}

export async function isLoggedIn() {
	return await isLoggedInServer()
}

async function registerServer(formData: FormData) {
	"use server"
	const username = String(formData.get("username"));
	const password = String(formData.get("password"));
	const email = String(formData.get("email"));

	const sessionData = await session()
	const userId = await generateUserId()
	if (userId.success) {
		addUser(userId.id, username, password, email)
		await sessionData.update((d: UserSession) => { d.userId = userId.id; return d })
	} else {
		throw new Error("Invalid Register")
	}
}

export async function register(formData: FormData): Promise<RESPONSE> {
	try {
		await registerServer(formData)
		return {
			success: true
		}
	} catch (err) {
		return errorResult(err)
	}
}

async function loginServer(formData: FormData) {
	"use server"
	const username = String(formData.get("username"));
	const password = String(formData.get("password"));

	const sessionData = await session()
	const user = getUserName(username)

	if (!user?.success) {
		throw new Error("Invalid login");
	}
	const userData = user.data
	if (!userData || !verifyPassword(password, userData.salt, userData.password_hash)) {
		throw new Error("Invalid login");
	}
	await sessionData.update((d: UserSession) => { d.userId = userData.id; return d })
}

export async function login(formData: FormData): Promise<RESPONSE> {
	try {
		await loginServer(formData)
		return {
			success: true
		}
	} catch (err) {
		return errorResult(err)
	}
}

async function logoutServer() {
	"use server"
	const sessionData = await session()
	await sessionData.update((d: UserSession) => { d.userId = undefined; return d })
}

export async function logout(): Promise<RESPONSE> {
	try {
		await logoutServer()
		return {
			success: true
		}
	} catch (err) {
		return errorResult(err)
	}
}