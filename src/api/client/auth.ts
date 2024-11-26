import session from '../server/session'
import { addUser, getUserName, verifyPassword } from "../server/db";

function errorResult(err: unknown): ERRORRESPONSE {
	return {
		success: false,
		error: (err instanceof Error) ? err.message : (typeof err === 'string' ? err : 'Unknown error')
	} as const
}

async function isLoggedInServer(): Promise<boolean> {
	"use server"
	try {
		const sessionData = await session();
		return typeof sessionData.data.userId === 'number';
	} catch (error) {
		return false;
	}
}

export async function isLoggedIn() {
	return await isLoggedInServer()
}

async function registerServer(formData: FormData): Promise<void> {
	"use server"
	const username = String(formData.get("username"));
	const password = String(formData.get("password"));
	const email = String(formData.get("email"));


	const sessionData = await session()
	const result = addUser(username, password, email)
	if (result.success) {
		const userData = getUserName(username)
		if (userData.success) {
			await sessionData.update((d: UserSession) => { d.userId = userData.data.id; return d })
		}
	}
}

export async function register(formData: FormData): Promise<CONFIRM> {
	try {
		await registerServer(formData)
		return { success: true }
	} catch (err) {
		return errorResult(err)
	}
}

async function loginServer(formData: FormData): Promise<void> {
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

export async function login(formData: FormData): Promise<CONFIRM> {
	try {
		await loginServer(formData)
		return { success: true }
	} catch (err) {
		return errorResult(err)
	}
}

async function logoutServer(): Promise<void> {
	"use server"
	const sessionData = await session()
	await sessionData.update((d: UserSession) => {
		d.userId = undefined;
		return d
	})
}

export async function logout(): Promise<CONFIRM> {
	try {
		await logoutServer()
		return { success: true }
	} catch (err) {
		return errorResult(err)
	}
}