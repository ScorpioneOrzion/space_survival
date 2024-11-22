import { getUserId, getUserName, isInternalUSERACCOUNT, isPrivateUSERACCOUNT, isPublicUSERACCOUNT, isUserSession, toFakePrivate, toPrivate, toPublic } from "../server/db";
import session from "../server/session";

export async function getUserInfoPrivate(): Promise<RESPONSE<PrivateUSERACCOUNT>> {
	"use server"
	const sessionData = await session()

	if (!sessionData?.data || !isUserSession(sessionData.data)) {
		return { success: false, error: "USERERROR" }
	}

	const user = getUserId(sessionData.data.userId)

	if (user.success) {
		if (isInternalUSERACCOUNT(user.data)) {
			return { success: true, data: toPrivate(user.data) }
		}
		return { success: false, error: "IsNotUser" }
	}

	return { success: false, error: "User not found" }
}

export async function getUserInfo(targetUsername: string, currentUsername: string): Promise<RESPONSE<PrivateUSERACCOUNT>> {
	"use server"
	const targetUser = getUserName(targetUsername)

	if (!targetUser.success) {
		return { success: false, error: "User not found" }
	}

	if (targetUser.data.current_status === "DELETED") {
		return { success: false, error: "User not found" }
	}

	if (targetUser.data.username === currentUsername) {
		return { success: true, data: toPrivate(targetUser.data) }
	} else {
		return { success: true, data: toFakePrivate(toPublic(targetUser.data)) }
	}
}