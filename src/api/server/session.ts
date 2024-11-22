import { isServer } from "solid-js/web";
import { useSession } from "vinxi/http";

export default function () {
	if (!isServer) throw 'ONLY USE ON SERVER'
	return useSession<UserSession>({
		password: process.env.SESSION_SECRET!,
	});
}