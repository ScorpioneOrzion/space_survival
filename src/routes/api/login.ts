// import { redirect } from "@solidjs/router";
// import { useSession } from "vinxi/http";

// type UserSession = {
// 	userId?: number;
// }

// function getSession() {
// 	return useSession({
// 		password: process.env.SESSION_SECRET
// 	})
// }

// export async function login(formData: FormData) {
// 	const username = String(formData.get("username"));
// 	const password = String(formData.get("password"));
// 	// do validation
// 	try {
// 		const session = await getSession();
// 		const user = await db.user.findUnique({ where: { username } });
// 		if (!user || password !== user.password) return new Error("Invalid login");
// 		await session.update((d: UserSession) => (d.userId = user!.id));
// 	} catch (err) {
// 		return err as Error;
// 	}
// 	throw redirect("/");
// }

// export async function logout() {
// 	const session = await getSession();
// 	await session.update((d: UserSession) => (d.userId = undefined));
// 	throw redirect("/login");
// }