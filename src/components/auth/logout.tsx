import isHTMLElement from "~/helper/isHTMLElement";
import createHTMLSignal from "~/helper/createHTMLSignal";
import { logout } from "~/routes/api/client/auth";
import isSuccess from "~/helper/isSuccess";

export default function ({ checkStatus, setErrorMessage }: { checkStatus: () => Promise<void>, setErrorMessage: (msg: string) => void }) {
	async function handleLogoutSubmit(e: SubmitEvent) {
		e.preventDefault()
		const response = await logout();
		if (isSuccess(response)) await checkStatus()
		else setErrorMessage(response.error)
	}

	return (
		<form onSubmit={handleLogoutSubmit} class={'auth'}>
			<div class={"form-group"}>
				<input type="submit" value={'Log Out'} />
			</div>
		</form>
	)
}