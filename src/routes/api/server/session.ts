import { useSession } from "vinxi/http";
import onServer from "~/helper/onServer";

export default function () {
	if (!onServer()) throw 'ONLY USE ON SERVER'
	return useSession<UserSession>({
		password: process.env.SESSION_SECRET!,
	});
}