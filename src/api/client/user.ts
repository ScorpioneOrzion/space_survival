import { getUserId, isUser } from "../server/db";
import session from "../server/session";

export async function getUserInfo(): Promise<RESPONSE<USERACCOUNT>> {
	"use server"
	const sessionData = await session()

	const user = getUserId(sessionData.data.userId)

	if (user.success) {
		if (isUser(user.data)) {
			const { email, username } = user.data
			return { success: true, data: { email, username } }
		}
		return { success: false, error: "IsNotUser" }
	}
	return { success: false, error: "USERERROR" }

}